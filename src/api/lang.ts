type Lang = "auto" |
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

export type {Lang, Query, TranslateResp, Platform}
