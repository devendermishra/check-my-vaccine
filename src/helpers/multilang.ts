
declare global {
    var selectedLanguage: string
}
globalThis.selectedLanguage = 'en'

const languageMap: Record<string, Record<string, string>> = {}


export const getTranslate = (code: string): string => {
    let langCode = globalThis.selectedLanguage
    if (!langCode) {
        langCode = 'en'
    }
    const translation = languageMap ?
        languageMap[langCode] ?
            languageMap[langCode][code] : null
        : null
    return translation ? translation : code
}

export const getTranslateWithKeys = (code: string,
    keys: Record<string, string>): string => {
    let translationString = getTranslate(code)
    Object.keys(keys).forEach(key => {
        translationString = translationString.replaceAll('{' + key + '}',
            keys[key])
    })
    return translationString
}

export const _T = getTranslate
export const _TK = getTranslateWithKeys

export const selectLanguage = (languageCode: string) => {
    if (Object.keys(languageMap).includes(languageCode)) {
        globalThis.selectedLanguage = languageCode
    } else {
        console.error("Unsupported language " + languageCode)
    }
}

export const getSelectedLanguage = () => globalThis.selectedLanguage

export const loadLanguage = (languageFile: Array<Record<string, string>>) => {
    if (languageFile.length > 1) {
        languageFile.forEach(translationRecord => {
            const stringId = translationRecord.id
            Object.keys(translationRecord).forEach(key => {
                if (key !== 'id') {
                    if (!languageMap[key]) {
                        languageMap[key] = {}
                    }
                    languageMap[key][stringId] = translationRecord[key]
                }
            })
        })
    }
}
