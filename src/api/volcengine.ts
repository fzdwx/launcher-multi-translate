import {Query} from "./lang.ts";

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
//@ts-ignore
const langMap = new Map(supportedLanguages);
const langMapReverse = new Map(supportedLanguages.map(([standardLang, lang]) => [lang, standardLang]));
async function volcengineTranslate(query: Query) {
    const targetLanguage = langMap.get(query.to);
    const sourceLanguage = langMap.get(query.from);
    const source_lang = sourceLanguage || 'ZH';
    const target_lang = targetLanguage || 'EN';
    const translate_text = query.text || '';
    const url = 'https://translate.volcengine.com/crx/translate/v1';
    const resp = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "source_language": source_lang,
            "target_language": target_lang,
            "text": translate_text,
        })
    });

    const r = await resp.json()
    return {
        text: r['translation'],
        from: langMapReverse.get(r['detected_language']),
        to: query.to,
    }
}

export {volcengineTranslate}
