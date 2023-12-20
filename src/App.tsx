import {Command, useCommandState} from 'launcher-api'
import React, {useEffect, useState} from 'react'
import {useInterval, useKeyPress, useRequest} from 'ahooks';
import {googleTranslate} from "./api/google.ts"
import {caiYunTranslate} from "./api";
import {Query, TranslateResp} from "./api/lang.ts";
import Icon, {getIcon} from "./icon.tsx";
import LangSwitch from "./components/LangSwitch.tsx";

const platforms = [
    googleTranslate,
    caiYunTranslate
]

const TextDiv = ({resp}: { resp: Map<string, TranslateResp> }) => {
    const current = useCommandState(state => {
        if (!state.value) {
            return
        }
        return resp.get(state.value.toLowerCase())
    })

    return (
        <div className='whitespace-pre-wrap break-words p-2 m-2'>
           <span>
                {current?.text}
           </span>
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
    const [shouldListening, setListening] = useState(false)
    const [value, setValue] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [resp, setResp] =
        useState<Map<string, TranslateResp>>(new Map<string, TranslateResp>())

    const translate = async (text: string, from: string, to: string) => {
        if (text == "" || text.length == 0) {
            return
        }

        const query = {text, from, to} as Query

        setLoading(true)
        for (const f of platforms) {
            const r = await f(query)
            const prevResp = resp
            prevResp.set(r.platform.toLowerCase(), r)
            setResp(prevResp)
        }
        setLoading(false)
    }

    const refreshTextFromClip = async () => {
        const newText = await window.launcher.getSelect();
        if (newText === text) {
            return
        }

        setValue(newText)
    }

    const {run} = useRequest(translate, {
        debounceWait: 500,
        manual: true,
    })

    useEffect(() => {
        run(text, from, to)
    }, [text, from, to])

    useEffect(() => {
        setText(value)
    }, [value])

    useEffect(() => {
        refreshTextFromClip()
    }, [])

    useKeyPress("ctrl.l", (e) => {
        e.preventDefault()
        setListening(!shouldListening)
    })

    useInterval(async () => {
        if (shouldListening) {
            await refreshTextFromClip();
        }
    }, 100)

    return (
        <Command className='raycast' shouldFilter={false}>
            <div cmdk-raycast-top-shine=""/>
            <div className='flex'>
                <div className='w-600px'>
                    <Command.Input loading={loading} value={value} onValueChange={(v)=>{
                        setValue(v)
                        setListening(false)
                    }} autoFocus ref={inputRef}/>
                </div>
                <LangSwitch fromChange={setFrom} toChange={setTo}/>
            </div>

            <div className="flex">
                <div className='w-30%'>
                    <Command.List ref={listRef}>
                        {
                            Array.from(resp.values()).map((v, i) => {
                                return (
                                    <Command.Item
                                        key={i}
                                        data-value={v.platform} onSelect={() => {
                                        window.launcher.hide()
                                        window.launcher.setClipText(v.text)
                                    }}>
                                        <div>
                                            {getIcon(v.platform)}
                                        </div>

                                        <div>
                                            {v.platform}
                                        </div>

                                    </Command.Item>
                                )
                            })
                        }
                    </Command.List>
                </div>
                <div className='border-r-style-solid border mt-2 mr-2  border-gray/25'/>

                <div className='w-70% max-w-70% min-w-70%'>
                    <TextDiv resp={resp}/>
                </div>
            </div>

            <div cmdk-raycast-footer="">
                <Icon/>

                <button cmdk-raycast-open-trigger="">
                    <span className='pr-1'>Copy to Clipboard</span>

                    <kbd>↵</kbd>
                </button>

                <hr/>

                <button cmdk-raycast-open-trigger="" onClick={()=>{
                    setListening(!shouldListening)
                }}>
                    <span className='pr-1'>Listen Mode</span>
                    <span className='pr-1'>{shouldListening? "ON":"OFF"}</span>

                    <span className='pr-1'><kbd>ctrl</kbd></span>

                    <span><kbd>l</kbd></span>
                </button>

            </div>
        </Command>
    )
}

export default App
