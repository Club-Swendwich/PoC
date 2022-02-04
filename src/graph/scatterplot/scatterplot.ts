import {Color, hexToColor, int, real, Shape} from "../../common/types";
import {symbolStar} from "d3";
import {GraphableType, GraphableTypeToRepr} from "../graph";
import {LITERAL_VALUE} from "../../common/selector";


export interface SPEntry {
    x:     GraphableTypeToRepr<GraphableType.Real>
    y:     GraphableTypeToRepr<GraphableType.Real>
    size:  GraphableTypeToRepr<GraphableType.Int>
    shape: GraphableTypeToRepr<GraphableType.Shape>
    color: GraphableTypeToRepr<GraphableType.Color>
}

export interface SPSettings {
    domainX: [number, number]
    domainY: [number, number]
    colors:  Color[]
    shapes:  Shape[]
}

export interface SPDimensionSelection {
    x:     [string, string]
    y:     [string, string]
    size:  [string, string]
    shape: [string, string]
    color: [string, string]
}

export interface SPView {
    settings:   SPSettings
    dimensions: SPDimensionSelection
}
