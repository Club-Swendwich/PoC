import {SPEntry, SPSettings} from "./scatterplot";
import {seriesWebglMulti, seriesWebglPoint, webglFillColor, chartCartesian} from 'd3fc';
import {decodeShape, Shape} from "../../common/types";
import {useEffect, useRef} from "react";
import {scaleLinear, select} from "d3";

export interface SPRenderProp {
    data:     SPEntry[];
    settings: SPSettings;
}

export const SPRender = (prop: SPRenderProp) => {
    const { data, settings } = prop
    const chartRenderArea = useRef(null);

    console.log(data)

    useEffect(() => {
        const makeSeries = (data: SPEntry[], symbol: Shape) => {
            return seriesWebglPoint()
                .xScale(xAxis)
                .yScale(yAxis)
                .crossValue((p: SPEntry) => p.x)
                .mainValue((p: SPEntry) => p.y)
                .size((p: SPEntry) => p.size)
                .type(decodeShape(symbol))
                .decorate((context: any, data: SPEntry[]) => {
                    const fill = webglFillColor()
                        .value((d: SPEntry) => d.color)
                        .data(data)
                    // TODO: Supportare trasparenze?
                    //const webgl = context.context()
                    //webgl.enable(webgl.BLEND)
                    fill(context)
                })
        }

        const xAxis = scaleLinear().domain(settings.domainX)
        const yAxis = scaleLinear().domain(settings.domainY)

        // Lo shader riesce a disegnare solo una ``shape`` per volta
        const series = Array.from(group(data).entries())
            .map(e => makeSeries(e[1], e[0]));

        const multiSeries = seriesWebglMulti()
            .xScale(xAxis)
            .yScale(yAxis)
            .series(series);

        const graph = chartCartesian(xAxis, yAxis)
            .webglPlotArea(multiSeries)

        // Hook per forzare il rerender quando si vorranno aggiungere effetti.
        const render = () => {
            console.log("call render")
            select(chartRenderArea.current)
                .datum(data)
                .call(graph)
        }
        render();
    }, [data, settings.domainX, settings.domainY])

    return (
        <div className="renderArea" ref={chartRenderArea}/>
    )
}

function group(entries: SPEntry[]): Map<Shape, SPEntry[]>{
    return entries.reduce((p, c) => {
        const v = p.get(c.shape)
        if (v === undefined) {
            p.set(c.shape, [c])
        } else {
            v.push(c)
        }
        return p
    }, new Map<Shape, SPEntry[]>())
}