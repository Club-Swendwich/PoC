import {ColorSelector, IntSelector, RealSelector, ShapeSelector} from "../../common/selector";
import {DataSignature} from "../../model/data";
import {Dispatch, FormEventHandler, useState} from "react";
import {SPDimensionSelection} from "./scatterplot";
import {ConverterSignature} from "../../model/converter";
import {GraphableType} from "../graph";

export interface SPDimensionSelectorProp {
    dataSignature:         DataSignature
    converterSignature:   ConverterSignature
    dimensionSelection:    SPDimensionSelection
    setDimensionSelection: Dispatch<SPDimensionSelection>
}

export const SPDimensionSelector = (prop: SPDimensionSelectorProp) => {
    const { dataSignature, converterSignature, dimensionSelection, setDimensionSelection } = prop

    const [x,     setX]     = useState(dimensionSelection.x)
    const [y,     setY]     = useState(dimensionSelection.y)
    const [size,  setSize]  = useState(dimensionSelection.size)
    const [shape, setShape] = useState(dimensionSelection.shape)
    const [color, setColor] = useState(dimensionSelection.color)

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        setDimensionSelection({
            x: x,
            y: y,
            size: size,
            shape: shape,
            color: color
        })
    }

    const real = converterSignature.get(GraphableType.Real)
    const int = converterSignature.get(GraphableType.Int)
    const sshape = converterSignature.get(GraphableType.Shape)
    const ccolor = converterSignature.get(GraphableType.Color)

    return (
        <form className="dimensionSelector" onSubmit={onSubmit}>
            <label>X Axis:</label>
            <RealSelector converters={real !== undefined ? real : new Map()}
                          name="axisx"
                          signature={dataSignature}
                          selection={{
                              set: setX,
                              get: x
                          }} />
            <label>Y Axis:</label>
            <RealSelector converters={real !== undefined ? real : new Map()}
                          name="axisy"
                          signature={dataSignature}
                          selection={{
                              set: setY,
                              get: y
                          }} />
            <label>Size:</label>
            <IntSelector converters={int !== undefined ? int : new Map()}
                         name="size"
                         signature={dataSignature}
                         selection={{
                             set: setSize,
                             get: size
                         }} />
            <label>Shape:</label>
            <ShapeSelector converters={sshape !== undefined ? sshape : new Map()}
                           name="shape"
                           signature={dataSignature}
                           selection={{
                               set: setShape,
                               get: shape
                           }} />
            <label>Color:</label>
            <ColorSelector converters={ccolor !== undefined ? ccolor : new Map()}
                           name="shape"
                           signature={dataSignature}
                           selection={{
                               set: setColor,
                               get: color
                           }} />
            <input type="submit" value="Applica dimensioni"/>
        </form>
    );
}