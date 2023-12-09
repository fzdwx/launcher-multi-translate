const GoogleHost = 'googleapis.com';
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

const langMap = new Map(supportedLanguages);
const langMapReverse = new Map(supportedLanguages.map(([standardLang, lang]) => [lang, standardLang]));
export async function googleTranslate(
    query: Query,
): Promise<string> {
    const urll = `https://translate.${GoogleHost}/translate_a/single`;
    const data = {
        client: 'gtx',
        sl: langMap.get(query.from),
        tl: langMap.get(query.to),
        hl: langMap.get(query.to),
        ie: 'UTF-8',
        oe: 'UTF-8',
        otf: '1',
        ssel: '0',
        tsel: '0',
        kc: '7',
        q: query.text,
    };

    const parameters = new URLSearchParams();

    for (const [key, value] of Object.entries(data)) {
        parameters.append(key, value);
    }

    for (const v of ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't']) {
        parameters.append('dt', v);
    }

    const url = `${urll}?${parameters.toString()}`;
    const body = await (await fetch(url)).json();

    let result = {
        text: "",
        from: {
            language: {
                didYouMean: false,
                iso: ""
            },
            text: {
                autoCorrected: false,
                value: "",
                didYouMean: false
            }
        },
        raw: ""
    };

    body[0].forEach((obj) => {
        if (obj[0]) {
            result.text += obj[0];
        }
    });

    if (body[2] === body[8][0][0]) {
        result.from.language.iso = body[2];
    } else {
        result.from.language.didYouMean = true;
        result.from.language.iso = body[8][0][0];
    }

    if (body[7] && body[7][0]) {
        let str = body[7][0];

        str = str.replace(/<b><i>/g, "[");
        str = str.replace(/<\/i><\/b>/g, "]");

        result.from.text.value = str;

        if (body[7][5] === true) {
            result.from.text.autoCorrected = true;
        } else {
            result.from.text.didYouMean = true;
        }
    }
    return {
        text: result.text,
        from: langMapReverse.get(result.from.language.iso),
        to: query.to,
    } as TranslateResp;
}
