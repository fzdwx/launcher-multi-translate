import {Select} from "antd";
import React, {useEffect} from "react";
import {langToChinese} from "../api/lang.ts";
import {atom, useAtom, useStore} from "jotai";
import {containsChinese} from "./util.tsx";

const fromAtom = atom('en')
const toAtom = atom('zh-Hans')

interface Props {
    fromChange: (val: string) => void
    toChange: (val: string) => void
    value: string
}

export default ({fromChange, toChange, value}: Props) => {
    const [from, setFrom] = useAtom(fromAtom);
    const [to, setTo] = useAtom(toAtom)

    useEffect(() => {
        fromChange(from)
    }, [from])
    useEffect(() => {
        toChange(to)
    }, [to])
    useEffect(() => {
        if (containsChinese(value)) {
            setFrom('zh-Hans')
            setTo('en')
        }
    }, [value])

    return <>
        <div className='flex pt-3'>
            <Select
                value={from}
                style={{width: 100}}
                options={[
                    {value: 'zh-Hans', label: langToChinese['zh-Hans']},
                    {value: 'en', label: langToChinese['en']},
                ]}
                onChange={setFrom}
            />

            <div className='px-2 pt-1 cursor-default'
                 onClick={() => {
                     setFrom(to)
                     setTo(from)
                 }}
            >switch
            </div>

            <Select
                value={to}
                style={{width: 100}}
                options={[
                    {value: 'zh-Hans', label: langToChinese['zh-Hans']},
                    {value: 'en', label: langToChinese['en']},
                ]}
                onChange={setTo}
            />
        </div>
    </>
}
