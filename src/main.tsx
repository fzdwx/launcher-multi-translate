import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'virtual:uno.css'
import './index.css'
import "launcher-api/dist/index.css"
import {createStore, Provider} from "jotai";

const store = createStore()
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Suspense fallback={"Loading..."}>
            <Provider store={store}>
                <div className='h-540px dark text-white bg-dark/90 backdrop-blur '>
                    <App/>
                </div>
            </Provider>
        </Suspense>
    </React.StrictMode>,
)
