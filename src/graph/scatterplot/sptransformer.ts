import {SPDimensionSelection, SPEntry} from "./scatterplot";
import {Converter} from "../../model/converter";
import {GraphableType, GraphableTypeToRepr} from "../graph";
import {LITERAL_VALUE} from "../../common/selector";
import {Data, DataSignature, parseShape} from "../../model/data";
import {Color, hexToColor, int, real, Shape} from "../../common/types";



export class SPTransformer {

    private readonly x:     (x: any) => GraphableTypeToRepr<GraphableType.Real>
    private readonly y:     (x: any) => GraphableTypeToRepr<GraphableType.Real>
    private readonly size:  (x: any) => GraphableTypeToRepr<GraphableType.Int>
    private readonly shape: (x: any) => GraphableTypeToRepr<GraphableType.Shape>
    private readonly color: (x: any) => GraphableTypeToRepr<GraphableType.Color>

    constructor(settings: SPDimensionSelection, converter: Converter, signature: DataSignature) {
        if (settings.x[0] === LITERAL_VALUE) {
            this.x = _ => +(settings.x[1])
        } else {
            const xH = converter.provide(signature.get(settings.x[0])!, GraphableType.Real, settings.x[1])
            this.x = d => {
                return xH(d.get(settings.x[0])!) as real
            }
        }

        if (settings.y[0] === LITERAL_VALUE) {
            this.y = _ => +(settings.y[1])
        } else {
            const yH = converter.provide(signature.get(settings.y[0])!, GraphableType.Real, settings.y[1])
            this.y = d => yH(d.get(settings.y[0])!) as real
        }

        if (settings.size[0] === LITERAL_VALUE) {
            this.size = _ => +(settings.size[1])
        } else {
            const sizeH = converter.provide(signature.get(settings.size[0])!, GraphableType.Int, settings.size[1])
            this.size = d => sizeH(d.get(settings.size[0])!) as int
        }

        if (settings.shape[0] === LITERAL_VALUE) {
            this.shape = _ => (settings.shape[1]) as any
        } else {
            const shapeH = converter.provide(signature.get(settings.shape[0])!, GraphableType.Shape, settings.shape[1])
            this.shape = d => shapeH(d.get(settings.shape[0])!) as Shape
        }

        if (settings.color[0] === LITERAL_VALUE) {
            this.color = _ => hexToColor(settings.color[1])
        } else {
            const colorH = converter.provide(signature.get(settings.color[0])!, GraphableType.Color, settings.color[1])
            this.color = d => colorH(d.get(settings.color[0])!) as Color
        }
    }


    public transform(data: Data): SPEntry[] {
        return data.entries().map(e => {
            return {
                x:     this.x(e),
                y:     this.y(e),
                size:  this.size(e),
                shape: this.shape(e),
                color: this.color(e),
            } as SPEntry
        })
    }
}