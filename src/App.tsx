import React, {useEffect, useState} from 'react';
import './App.css';
import {SPUI} from "./graph/scatterplot/scatterplotui";
import {Data, DataType} from "./model/data";
import {defaultConverter} from "./model/converter";
import {load} from "./io/csv";
import {hexToColor} from "./common/types";
import {LITERAL_VALUE} from "./common/selector";
import {SPDimensionSelection, SPSettings} from "./graph/scatterplot/scatterplot";

function App() {

    const view = {
        kind: "ScatterPlot",
        settings: {
            domainX: [1, 33000],
            //domainY: [1624200000000, 1625051710000],
            domainY: [1600651710000, 1625051710000],
            colors: ["#00FA9A", "#DC143C", "#00BFFF",].map(hexToColor),
            shapes: ["star"]
        } as SPSettings,
        dimensions: {
            x: ["userId", "id"],
            y: ["timestamp", "id"],
            size: [LITERAL_VALUE, "1"],
            shape: [LITERAL_VALUE, "star"],
            color: ["eventType", "as color"]
        } as SPDimensionSelection,
    }

    const [data, setData] = useState<null | Data>(null)

    useEffect(() => {
        load().then(r => setData(r))
    }, [])

    if (data !== null) {
        return (
            <div className="App">
                <SPUI data={data}
                      converter={defaultConverter} view={view}/>
            </div>
        )
    } else {
        return (<p>Caricamento dataset in corso</p>)
    }
}

export default App;
