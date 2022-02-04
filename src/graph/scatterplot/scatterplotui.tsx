import {GraphUI} from "../graph";
import React, {useState} from "react";
import {SPRender} from "./scatterplotrender";
import {SPView} from "./scatterplot";
import {SPDimensionSelector} from "./scatterplotdimensionselector";
import {SPTransformer} from "./sptransformer";




export const SPUI: GraphUI<SPView> = (prop) => {
    const { data, converter, view } = prop

    const [settings,           setSettings]           = useState(view.settings)
    const [dimensionSelection, setDimensionSelection] = useState(view.dimensions)

    const transformer = new SPTransformer(dimensionSelection, converter, data.signature)
    const spData = transformer.transform(data)

    return (
        <div className="graph">
            <SPRender data={spData} settings={settings} />
            <div className="settingsArea">
                <SPDimensionSelector dataSignature={data.signature}
                                     converterSignature={converter.signature}
                                     dimensionSelection={dimensionSelection}
                                     setDimensionSelection={setDimensionSelection}/>
            </div>
        </div>
    );
}