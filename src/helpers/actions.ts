import { Action, FavoriteSite, SearchResult, Site, SlotData } from "./types"

export const SELECT_STATE = 'SELECT_STATE'
export const SELECT_DISTRICT = 'SELECT_DISTRICT'
export const SELECT_PINCODE = 'SELECT_PINCODE'
export const SELECT_VACCINE = 'SELECT_VACCINE'
export const SELECT_DOSE = 'SELECT_DOSE'
export const SELECT_WEEK = 'SELECT_WEEK'
export const SELECT_AGE = 'SELECT_AGE'
export const SET_MODE = 'SET_MODE'
export const SET_STATUS = 'SET_STATUS'
export const SET_SLOT = 'SET_SLOT'
export const SET_INTERVAL = 'SET_INTERVAL'
export const SET_LANGUAGE = 'SET_LANGUAGE'
export const SET_THRESHOLD = 'SET_THRESHOLD'
export const SET_STORAGE_CONFIGS = 'SET_STORAGE_CONFIGS'
export const ADD_FAVORITE_SLOT = 'ADD_FAVORITE_SLOT'
export const DEL_FAVORITE_SLOT = 'DEL_FAVORITE_SLOT'
export const DEL_EXISTING_FAVORITE_SLOT = 'DEL_EXISTING_FAVORITE_SLOT'
export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT'
export const ADD_FAV_SITE = 'ADD_FAV_SITE'
export const DEL_FAV_SITE = 'DEL_FAV_SITE'

export const selectState = (state: number): Action => ({ type: SELECT_STATE, data: state })
export const selectDistrict = (district: number): Action => ({ type: SELECT_DISTRICT, data: district })
export const selectPincode = (pincode: number): Action => ({ type: SELECT_PINCODE, data: pincode })
export const selectVaccine = (vaccine: string): Action => ({ type: SELECT_VACCINE, data: vaccine })
export const selectDose = (dose: number): Action => ({ type: SELECT_DOSE, data: dose })
export const selectWeek = (week: number): Action => ({ type: SELECT_WEEK, data: week })
export const selectAge = (age: number): Action => ({ type: SELECT_AGE, data: age })
export const setMode = (mode: string): Action => ({ type: SET_MODE, data: mode })
export const setStatus = (status: string): Action => ({ type: SET_STATUS, data: status })
export const setSlot = (slots: SlotData[]): Action => ({ type: SET_SLOT, data: slots })
export const setPingInterval = (interval: number): Action => ({ type: SET_INTERVAL, data: interval })
export const setLanguage = (langCode: string): Action => ({ type: SET_LANGUAGE, data: langCode })
export const setThreshold = (threshold: number): Action => ({ type: SET_THRESHOLD, data: threshold })
export const setConfigs = (threshold: number, interval: number, favSites: FavoriteSite[]): Action => ({
    type: SET_STORAGE_CONFIGS,
    data: '' + threshold + '_' + interval + '_' + JSON.stringify(favSites)
})
export const setFavSlot = (slot: SlotData): Action => ({ type: ADD_FAVORITE_SLOT, data: slot })
export const delFavSlot = (slot: SlotData): Action => ({ type: DEL_FAVORITE_SLOT, data: slot })
export const remFavSlot = (slot: FavoriteSite): Action => ({type: DEL_EXISTING_FAVORITE_SLOT, data: slot})
export const setSearchResult = (result: SearchResult): Action => ({type: SET_SEARCH_RESULT, data: result})
export const addFavSite = (site: Site): Action => {
    const favSite: FavoriteSite = {...site}
    return ({type: ADD_FAV_SITE, data: favSite})
}
export const delFavSite = (site: Site): Action => {
    const favSite: FavoriteSite = {...site}
    return ({type: DEL_FAV_SITE, data: favSite})
}
