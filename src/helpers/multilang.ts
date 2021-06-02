const languageMap: Record<string, Record<string, string>> = {}
let selectedLanguage = 'hi'

export const getTranslate = (code: string): string => {
    const translation = languageMap ?
        languageMap[selectedLanguage] ?
            languageMap[selectedLanguage][code] : null
        : null
    return translation ? translation : code
}

export const getTranslateWithKeys = (code: string,
    keys: Record<string, string>): string => {
    let translationString = getTranslate(code)
    Object.keys(keys).forEach(key => {
        translationString.replaceAll('{' + key + '}',
            keys[key])
    })
    return translationString
}

export const _T = getTranslate
export const _TK = getTranslateWithKeys

export const selectLanguage = (languageCode: string) => {
    if (languageCode in Object.keys(languageMap)) {
        selectedLanguage = languageCode
    }
    console.error("Unsupported language " + languageCode)
}

export const getSelectedLanguage = (): string => selectedLanguage

export const loadLanguage = (languageFile: Array<Record<string, string>>) => {
    if (languageFile.length > 1) {
        languageFile.forEach(translationRecord => {
            const stringId = translationRecord.id
            Object.keys(translationRecord).forEach(key => {
                if (key !== 'id') {
                    if (!languageMap[key]) {
                        languageMap[key] ={}
                    }
                    languageMap[key][stringId] = translationRecord[key]
                }
            })
        })
    }
}
