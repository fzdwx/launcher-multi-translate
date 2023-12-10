import {Query, TranslateResp} from "./lang.ts";

const supportedLanguages = [
    ["auto", "auto"],
    ["de", "de"],
    ["en", "en"],
    ["es", "es"],
    ["fr", "fr"],
    ["it", "it"],
    ["ja", "ja"],
    ["ko", "ko"],
    ["nl", "nl"],
    ["pl", "pl"],
    ["pt", "pt"],
    ["ru", "ru"],
    ["zh-Hans", "zh"],
    ["zh-Hant", "zh"],
    ["bg", "bg"],
    ["cs", "cs"],
    ["da", "da"],
    ["el", "el"],
    ["et", "et"],
    ["fi", "fi"],
    ["hu", "hu"],
    ["lt", "lt"],
    ["lv", "lv"],
    ["ro", "ro"],
    ["sk", "sk"],
    ["sl", "sl"],
    ["sv", "sv"]
];

// @ts-ignore
const langMap = new Map(supportedLanguages);
const langMapReverse = new Map(supportedLanguages.map(([standardLang, lang]) => [lang, standardLang]));

function init_data(source_lang, target_lang) {
    return {
        "source": "",
        "detect": true,
        "os_type": "ios",
        "device_id": "F1F902F7-1780-4C88-848D-71F35D88A602",
        "trans_type": source_lang + "2" + target_lang,
        "media": "text",
        "request_id": 424238335,
        "user_id": "",
        "dict": true
    };
}

function getRandomNumber() {
    const rand = Math.floor(Math.random() * 99999) + 100000;
    return rand * 1000;
}

function supportLanguages() {
    return supportedLanguages.map(([standardLang]) => standardLang);
}

async function caiYunTranslate(query: Query) {
    const targetLanguage = langMap.get(query.to);
    const sourceLanguage = langMap.get(query.from);
    const source_lang = sourceLanguage || 'ZH';
    const target_lang = targetLanguage || 'EN';
    const translate_text = query.text || '';

    const url = 'https://interpreter.cyapi.cn/v1/translator';
    const post_data = init_data(source_lang, target_lang)
    post_data.source = translate_text
    post_data.request_id = getRandomNumber()

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': 'token ssdj273ksdiwi923bsd9',
            'user-agent': 'caiyunInterpreter/5 CFNetwork/1404.0.5 Darwin/22.3.0'
        },
        body: JSON.stringify(post_data),
    })

    const result = await resp.json()
    return {
        text: result.target,
        from: query.from,
        to: query.to,
        platform: "彩云小译"
    } as TranslateResp
}

export {caiYunTranslate}
