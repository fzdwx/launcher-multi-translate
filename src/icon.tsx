// @ts-ignore
import Img from '../public/img.png'
// @ts-ignore
import Google from '../public/google.svg'
import CaiYun from './caiyun.svg'
import {Platform} from "./api/lang.ts";

const Icon = () => {
    return <img src={Img} alt='icon'/>
}

const GoogleIcon = () => {
    return <img className='w-4 pt-1' src={Google} alt='icon'/>
}

const CaiYunIcon = () => {
    return <img className='w-4 pt-1' src={CaiYun} alt='icon'/>
}

const iconMap = {
    'Google': <GoogleIcon/>,
    '彩云小译': <CaiYunIcon/>
}

const getIcon = (name: Platform) => {
    return iconMap[name]
}

export {
    getIcon
}

export default Icon
