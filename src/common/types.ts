import {symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, SymbolType} from "d3";

export type int   = number;
export type real  = number;
export type Shape = "star" | "triangle" | "cross" | "square"
export type Color = [number, number, number, number];

export function decodeShape(shape: Shape): SymbolType {
    switch (shape) {
        case "star": return symbolStar
        case "triangle": return symbolTriangle
        case "cross": return symbolCross
        case "square": return symbolSquare
    }
}

export function hexToColor(hex: string): Color {
    //console.log("hex", hex)
    const res  = hex.match(/[a-f0-9]{2}/gi);
    const norm = res!.map(v => parseInt(v, 16) / 255);
    const alpha = norm.length === 4 ? norm[3] : 1;
    return [norm[0], norm[1], norm[2], alpha];
}