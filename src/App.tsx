import { Command, RaycastLightIcon, useCommandState } from 'launcher-api'
import React, { useEffect, useState } from 'react'
import { useInterval, useKeyPress, useRequest } from 'ahooks';

import { googleTranslate } from "./api/google.ts"
import { caiYunTranslate } from "./api";
import { Platform, Query, TranslateResp } from "./api/lang.ts";

const platforms = [
    googleTranslate,
    caiYunTranslate
]

// hello world
const TextDiv = ({ resp }: { resp: Map<string, TranslateResp> }) => {
    const current = useCommandState(state => {
        if (!state.value) {
            return
        }
        return resp.get(state.value.toLowerCase())
    })

    return (
        <div className='whitespace-pre-wrap break-words p-2 m-2'>
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
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('')
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

        setLoading(true)
        for (const f of platforms) {
            const r = await f(query)
            const prevResp = resp
            prevResp.set(r.platform.toLowerCase(), r)
            setResp(prevResp)
        }
        setLoading(false)
    }


    const { run } = useRequest(translate, {
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
        setValue(newText)
    }, 100)

    return (
        <Command className='raycast' shouldFilter={false}>
            <div cmdk-raycast-top-shine="" />
            <Command.Input loading={loading} value={value} autoFocus ref={inputRef} />

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
                <div className='border-r-style-solid border mt-2 mr-2  border-gray/25' />

                <div className='w-70% max-w-70% min-w-70%'>
                    <TextDiv resp={resp} />
                </div>
            </div>

            <div cmdk-raycast-footer="">
                <RaycastLightIcon />

                <button cmdk-raycast-open-trigger="">
                    Open Application
                    <kbd>↵</kbd>
                </button>

                <hr />

            </div>
        </Command>
    )
}

export default App
