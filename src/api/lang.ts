type Lang =
    "auto" |
    "de" |
    "en" |
    "es" |
    "fr" |
    "it" |
    "ja" |
    "ko" |
    "nl" |
    "pl" |
    "pt" |
    "ru" |
    "zh-Hans" |
    "zh-Hant" |
    "bg" |
    "cs" |
    "da" |
    "el" |
    "et" |
    "fi" |
    "hu" |
    "lt" |
    "lv" |
    "ro" |
    "sk" |
    "sl" |
    "sv"

const langToChinese = {
    "auto": "自动检测",
    "de": "德语",
    "en": "英语",
    "es": "西班牙语",
    "fr": "法语",
    "it": "意大利语",
    "ja": "日语",
    "ko": "韩语",
    "nl": "荷兰语",
    "pl": "波兰语",
    "pt": "葡萄牙语",
    "ru": "俄语",
    "zh-Hans": "简体中文",
    "zh-Hant": "繁体中文",
    "bg": "保加利亚语",
    "cs": "捷克语",
    "da": "丹麦语",
    "el": "希腊语",
    "et": "爱沙尼亚语",
    "fi": "芬兰语",
    "hu": "匈牙利语",
    "lt": "立陶宛语",
    "lv": "拉脱维亚语",
    "ro": "罗马尼亚语",
    "sk": "斯洛伐克语",
    "sl": "斯洛文尼亚语",
    "sv": "瑞典语"
}

type Query = {
    text: string
    from: Lang
    to: Lang
}

type TranslateResp = {
    text: string
    from: Lang
    to: Lang
    platform: Platform
}

type Platform = "彩云小译" | "Google"

export {langToChinese}

export type {Lang, Query, TranslateResp, Platform}
