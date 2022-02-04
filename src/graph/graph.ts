import {Data} from "../model/data";
import {Color, int, real, Shape} from "../common/types";
import {Converter} from "../model/converter";

export interface UIProp <T> {
    data: Data
    converter: Converter
    view: T
}

export type GraphUI <T> = (d: UIProp <T>) => JSX.Element

type GraphType = "ScatterPlot"

export enum GraphableType {
    Int,
    Real,
    Color,
    Shape,
}

export type GraphableTypeToRepr<T extends GraphableType>
    = T extends GraphableType.Int   ? int
    : T extends GraphableType.Real  ? real
    : T extends GraphableType.Color ? Color
    :                                 Shape