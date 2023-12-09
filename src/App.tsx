import {Command, RaycastLightIcon} from 'launcher-api'
import React from 'react'
import {
    SearchRepositoriesResponse,
    getRepo
} from './useRepo';
import {useKeyPress, useRequest} from 'ahooks';
import {formatDate} from "./date";
import {catYunTranslate} from "./api/caiyun.ts";

const numberFormatter = new Intl.NumberFormat("en-US", {notation: "compact", compactDisplay: "short"});
const App = () => {

    window.focus()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const {data, loading, run} = useRequest(getRepo, {
        debounceWait: 500,
        manual: true,
    });
    React.useEffect(() => {
        inputRef.current?.focus()
    })

    const onValueChange = (v: string) => {
        run(v)
    }

    useKeyPress('Esc', () => {
        window.launcher.loadMainView()
    })

    catYunTranslate({
        text: 'hello',
        from: 'auto',
        to: 'zh-Hans',
    }).then(res => {
        console.log(res)

    })
    return (
        <Command className='raycast' shouldFilter={false}>
            <div cmdk-raycast-top-shine=""/>
            <Command.Input loading={loading} onValueChange={onValueChange} autoFocus ref={inputRef}/>

            <Command.List ref={listRef}>
                asdasd
            </Command.List>

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
