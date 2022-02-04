import {Data, DataType} from "../model/data";
import {dsv} from "d3";

export async function load(): Promise<Data> {
    console.log("loading + parsing")
    const data = new Data(new Map([
        ["userId",    { kind: DataType.Int, data: []}],
        ["timestamp", { kind: DataType.Int, data: []}],
        ["eventType", { kind: DataType.Event, data: []}],
        ["encodedIp", { kind: DataType.String, data: []}],
        ["appId",     { kind: DataType.String, data: []}],
    ]));
    const raw = await dsv(";", "http://localhost:3000/coded_log.csv")

    raw.forEach((e) => {
        data.insert("userId", +e["a"]!)
        data.insert("timestamp", new Date(e["c"]!))
        data.insert("eventType", (+e["d"]!))
        data.insert("appId", e["e"]!)
        data.insert("encodedIp", e["g"])
    })

    console.log("end loading + parsing")
    return data
}