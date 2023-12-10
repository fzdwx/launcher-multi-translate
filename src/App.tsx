import {Command, RaycastLightIcon, useCommandState} from 'launcher-api'
import React, {useEffect, useState} from 'react'
import {useInterval, useKeyPress, useRequest} from 'ahooks';

import {googleTranslate} from "./api/google.ts"
import {caiYunTranslate} from "./api";
import {Platform, Query, TranslateResp} from "./api/lang.ts";

const platforms = [
    googleTranslate,
    caiYunTranslate
]

// hello world
const TextDiv = ({resp}: { resp: Map<string, TranslateResp> }) => {
    const current = useCommandState(state => {
        return resp.get(state.value.toLowerCase())
    })

    return (
        <div className='whitespace-pre'>
            {current?.text}
        </div>
    )
}

const App = () => {
    window.focus()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    React.useEffect(() => {
        inputRef.current?.focus()
    })
    useKeyPress('Esc', () => {
        window.launcher.loadMainView()
    })

    const [text, setText] = useState('')
    const [resp, setResp] =
        useState<Map<string, TranslateResp>>(new Map<string, TranslateResp>())

    const translate = async (text: string) => {
        if (text == "" || text.length == 0) {
            return
        }

        const query = {
            text: text,
            from: 'auto',
            to: 'zh-Hans'
        } as Query

        for (const f of platforms) {
            const r = await f(query)
            const prevResp = resp
            prevResp.set(r.platform.toLowerCase(), r)
            setResp(prevResp)
        }
    }


    const {loading, run} = useRequest(translate, {
        debounceWait: 500,
        manual: true,
    })

    useEffect(() => {
        run(text)
    }, [text])

    useInterval(async () => {
        const newText = await window.launcher.getSelect();
        if (newText === text) {
            return
        }

        setText(newText)
    }, 100)


    const onValueChange = (v: string) => {
    }

    return (
        <Command className='raycast' shouldFilter={false}>
            <div cmdk-raycast-top-shine=""/>
            <Command.Input loading={loading} onValueChange={onValueChange} autoFocus ref={inputRef}/>

            <div className="flex">
                <div className='w-30%'>
                    <Command.List ref={listRef}>
                        {
                            Array.from(resp.values()).map((v, i) => {
                                return (
                                    <Command.Item
                                        key={i}
                                        data-value={v.platform} onSelect={() => {
                                        window.launcher.setClipText(v.text)
                                    }}>
                                        {v.platform}
                                    </Command.Item>
                                )
                            })
                        }
                    </Command.List>
                </div>
                <div className='border-r-style-solid border border-gray/60 mt-2 mb-13 mr-2 '/>

                <div>
                    <TextDiv resp={resp}/>
                </div>
            </div>

            <div cmdk-raycast-footer="">
                <RaycastLightIcon/>

                <button cmdk-raycast-open-trigger="">
                    Open Application
                    <kbd>↵</kbd>
                </button>

                <hr/>

            </div>
        </Command>
    )
}

export default App
