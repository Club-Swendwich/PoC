import {Color, int, real, Shape} from '../common/types'
import {symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, SymbolType} from "d3";

type Entry = Map<String, any>

export class Data {
    private readonly columns: Map<string, Column>

    constructor(columns: Map<string, Column>) {
        this.columns = columns;
    }

    public get signature(): DataSignature {
        const kv = Array.from(this.columns.entries())
                        .map(([k, c]) => [k, c.kind] as const)
        return new Map(kv)
    }

    public get(index: number): Entry {
        return new Map(Array.from(this.columns.keys())
                             .map(k => [k, this.columns.get(k)!.data[index]] as const))
    }

    public get length(): number {
        if (this.columns.size === 0 ) return 0
        const aKey = this.columns.keys().next().value
        return this.columns.get(aKey)!.data.length
    }

    public insert(field: string, value: any) {
        const col = this.columns.get(field)!.data as any[]
        col.push(value)
    }

    public entries(): Entry[] {
        return Array.from(Array(this.length).keys())
                     .map(i => this.get(i))
    }
}

export function parseShape(shape: Shape): SymbolType {
    switch (shape) {
        case "star":
            return symbolStar
        case "triangle":
            return symbolTriangle
        case "cross":
            return symbolCross
        case "square":
            return symbolSquare
    }
}

export type DataSignature = Map<string, DataType>

export enum DataType {
    Int,
    Real,
    String,
    Event,
}

export enum EventType {
    Login = 1,
    LoginFail,
    Logout
}

export type DataTypeToRepr<T extends DataType>
    = T extends DataType.Int  ? int
    : T extends DataType.Real ? real
    : T extends DataType.Event ? EventType
    :                           string

export type Column
    = { readonly kind: DataType.Int;    data: DataTypeToRepr<DataType.Int>[]    }
    | { readonly kind: DataType.Real;   data: DataTypeToRepr<DataType.Real>[]   }
    | { readonly kind: DataType.String; data: DataTypeToRepr<DataType.String>[] }
    | { readonly kind: DataType.Event; data: DataTypeToRepr<DataType.Event>[] }

// TODO: Capire se è necessario andare così overkill e verificare staticametne che gli array siano della stessa
//  lunghezza
//type ArrayOfFixedLength<T extends any, N extends number> = readonly T[] & { length: N };

