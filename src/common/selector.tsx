import {DataSignature, DataType} from "../model/data"
import React, {ChangeEvent, ChangeEventHandler, Dispatch, FunctionComponent} from "react"


export const LITERAL_VALUE = "Literal"

interface SelectorProp {
    readonly name:       string
    readonly signature:  DataSignature
    readonly converters: Map<DataType, string[]>
    readonly selection: {
        readonly set: Dispatch<[string, string]>
        readonly get: [string, string]
    }
    readonly literal: {
        readonly default:   string
        readonly Component: FunctionComponent<DefaultProp>
    }
}

interface DefaultProp {
    readonly keyV:      string,
    readonly selected: string,
    readonly onChange: (s: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const Selector = (prop: SelectorProp) => {
    const { signature, converters, selection, literal, name } = prop

    const conversions = Array.from(signature.entries())
                             .filter(([_, type]) => converters.has(type))
                                                                             // Sicuro grazie al filter precedente!
                             .map(([field, type]) => [field, converters.get(type)!] as const)

    const associations = new Map(conversions);

    const setSelection0: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (s) => {
        const val = s.target.value;
        if (val === LITERAL_VALUE) {
            selection.set([val, literal.default])
        } else {
            selection.set([val, associations.get(val)![0]])
        }
    }
    const setSelection1: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (s) => {
        selection.set([selection.get[0], s.target.value])
    }

    const FieldOption = () => {
        return (
            <select value={selection.get[0]} onChange={setSelection0}>
                { Array.from(associations.keys())
                    .map(e => <option key={`${name}-${e}`} value={e}>{e}</option>) }
                <option key={`${name}-${LITERAL_VALUE}`} value={LITERAL_VALUE}>{LITERAL_VALUE}</option>
            </select>
        )
    }

    const literalInput = <literal.Component onChange={setSelection1}
                                            selected={selection.get[1]}
                                            keyV={`${name}-in`}/>

    const ConverterOption = () => {
        const option = selection.get[0]
        if (option === LITERAL_VALUE) {
            return literalInput
        }
        const opts = associations.get(option)
        return (
            <select value={selection.get[1]} onChange={setSelection1}>
                { (opts ? opts : []).map(e => <option key={`${name}-${option}`} value={e}>{e}</option>) }
            </select>
        )
    }

    return (
        <div>
            <FieldOption/>
            <ConverterOption/>
        </div>
    )
}

export type FSelectorProp = Omit<SelectorProp, "literal">

const DEFAULT_REAL = 0
export const RealSelector = (prop: FSelectorProp) => {
    const { signature, converters, selection, name } = prop
    return (
        <Selector signature={signature}
                  name={name}
                  converters={converters}
                  selection={selection}
                  literal={{
                      default:   DEFAULT_REAL.toString(),
                      Component: ({onChange, selected, keyV}) => (
                          <input onChange={onChange}
                                 value={selected}
                                 key={keyV}
                                 type="number"
                                 step="0.000001"/>
                      )
                  }} />
    )
}

const DEFAULT_INT = 0
export const IntSelector = (prop: FSelectorProp) => {
    const { signature, converters, selection, name } = prop
    return (
        <Selector signature={signature}
                  name={name}
                  converters={converters}
                  selection={selection}
                  literal={{
                      default:   DEFAULT_INT.toString(),
                      Component: ({onChange, selected, keyV}) => (
                          <input onChange={onChange}
                                 value={selected}
                                 key={keyV}
                                 type="number"
                                 step="1"/>
                      )
                  }} />
    )
}

const DEFAULT_COLOR = "#F5B7A4"
export const ColorSelector = (prop: FSelectorProp) => {
    const { signature, converters, selection, name } = prop
    return (
        <Selector signature={signature}
                  name={name}
                  converters={converters}
                  selection={selection}
                  literal={{
                      default:   DEFAULT_COLOR.toString(),
                      Component: ({onChange, selected, keyV}) => (
                          <input onChange={onChange}
                                 value={selected}
                                 key={keyV}
                                 type="color" />
                      )
                  }} />
    )
}

const DEFAULT_SHAPE = "star"
export const ShapeSelector = (prop: FSelectorProp) => {
    const { signature, converters, selection, name } = prop
    return (
        <Selector signature={signature}
                  name={name}
                  converters={converters}
                  selection={selection}
                  literal={{
                      default:   DEFAULT_SHAPE.toString(),
                      Component: ({onChange, selected, keyV}) => (
                          <select value={selected} onChange={onChange}>
                              <option key={`${name}-star`}>star</option>
                          </select>
                      )
                  }} />
    )
}
