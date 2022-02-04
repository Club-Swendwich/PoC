import {DataType, DataTypeToRepr, EventType} from './data'
import {GraphableType, GraphableTypeToRepr} from "../graph/graph";
import {Color, int, real, Shape} from "../common/types";
import {symbolCross, symbolDiamond, symbolStar, symbolTriangle} from "d3";

export type Conversion<F extends DataType, T extends GraphableType>
    = (d: DataTypeToRepr<F>) => GraphableTypeToRepr<T>

type CType = Map<GraphableType, Map<DataType, Map<string, Conversion<any, any>>>>

export class Converter {
    private readonly converters: CType
    constructor(converters: CType) {
        this.converters = converters
        console.log(converters)
    }

    public convert(from: DataType, to: GraphableType) {
        return this.converters.get(to)!.get(from)
    }

    public get signature(): ConverterSignature {
        const vMap = <V> (v: Map<DataType, Map<string, V>>) => {
            const kv = Array.from(v.entries())
                            .map(([k, v]) => [k, Array.from(v.keys())] as const)
            return new Map(kv)
        }
        const kv = Array.from(this.converters.entries())
                         .map(([k, v]) => [k, vMap(v)] as const)
        return new Map(kv)
    }

    public provide(from: DataType, to: GraphableType, name: string): Conversion<any, any> {
        console.log("provide", from, to, name)
        const conv  = this.converters.get(to)!.get(from)!.get(name)!
        console.log(conv)
        return conv
    }
}

export type ConverterSignature = Map<GraphableType, Map<DataType, string[]>>

function eventToColor(x: EventType): Color {
    if (x === EventType.Login) return [29 / 255, 172 / 225, 43 / 225, 1]
    if (x === EventType.LoginFail) return [234 / 255, 1 / 225, 21 / 225, 1]
    if (x === EventType.Logout) return [234 / 255, 109 / 225, 247 / 225, 1]
    return [1, 1, 1, 1]
}

function eventToShape(x: EventType): Shape {
    if (x === EventType.Login) return "star"
    if (x === EventType.LoginFail) return "cross"
    if (x === EventType.Logout) return "triangle"
    console.log(x)
    return "square"
}

export const defaultConverter = new Converter(new Map([
    [GraphableType.Real, new Map([
        [DataType.Real, new Map([
            ["id", (x: real) => x]
        ])],
        [DataType.Int, new Map([
            ["id", (x: int) => x]
        ])]
    ])],
    [GraphableType.Int, new Map([
        [DataType.Int, new Map([
            ["id", (x: int) => x]
        ])]
    ])],
    [GraphableType.Color, new Map([
        [DataType.Event, new Map([
            ["as color", eventToColor as any]
        ])]
    ])],
    [GraphableType.Shape, new Map([
        [DataType.Event, new Map([
            ["as shape", eventToShape as any]
        ])]
    ])]
]) as CType)



// interface DependentMap<Props extends { [key : string] : unknown }>
//     extends Map<keyof Props, Props[keyof Props]> {
//     get<K extends keyof Props>(key : K) : Props[K];
// }