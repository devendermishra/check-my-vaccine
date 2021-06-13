import {
    ADD_FAVORITE_SLOT,
    ADD_FAV_SITE,
    DEL_EXISTING_FAVORITE_SLOT,
    DEL_FAVORITE_SLOT,
    DEL_FAV_SITE,
    SELECT_AGE, SELECT_DISTRICT, SELECT_DOSE,
    SELECT_PINCODE, SELECT_STATE, SELECT_VACCINE, SELECT_WEEK, SET_INTERVAL, SET_LANGUAGE, SET_MODE, SET_SEARCH_RESULT, SET_SLOT, SET_STORAGE_CONFIGS, SET_THRESHOLD
} from "./actions";
import { Action, ApplicationState, FavoriteSite, SearchResult, Site, SlotData } from "./types";


const intialState: ApplicationState = { interval: 5, threshold: 1, favoriteSite: [], favoriteSiteSet: new Set() }
export const loadInitialState = (): ApplicationState => {
    let interval = localStorage.getItem('preferred_interval')
        let intervalValue = 5
        if (interval) {
            intervalValue = parseInt(interval)
        }
        let threshold = localStorage.getItem('min_threshold')
        let thresholdValue = 1
        if (threshold) {
            thresholdValue = parseInt(threshold)
        }
        let favSites: FavoriteSite[] = []
        let favSiteString = localStorage.getItem('fav_sites')
        if (favSiteString) {
            favSites = JSON.parse(favSiteString)
        }
        const favSiteSet = new Set(favSites.map(x=> x.centerId))
        if (isNaN(intervalValue)) {
            intervalValue = 5
        }
        if (isNaN(thresholdValue)) {
            thresholdValue = 1
        }

        const initialState: ApplicationState =
        { interval: intervalValue, threshold: thresholdValue,
            favoriteSite: favSites, favoriteSiteSet: favSiteSet}
        return initialState;
}

const reducer = (state = intialState, action: Action): ApplicationState => {
    switch (action.type) {
        case SELECT_STATE:
            return { ...state, selectedState: action.data as number }
        case SELECT_DISTRICT:
            return { ...state, selectedDistrict: action.data as number }
        case SELECT_PINCODE:
            return { ...state, selectedPin: action.data as number }
        case SELECT_DOSE:
            return { ...state, selectedDose: action.data as number }
        case SELECT_VACCINE:
            return { ...state, selectedVaccine: action.data as string }
        case SELECT_WEEK:
            return { ...state, selectedWeek: action.data as number }
        case SELECT_AGE:
            return { ...state, selectedAge: action.data as number }
        case SET_MODE:
            return { ...state, mode: action.data as string }
        case SET_SLOT:
            return { ...state, availableSlots: action.data as SlotData[] }
        case SET_INTERVAL:
            return { ...state, interval: action.data as number }
        case SET_LANGUAGE:
            return { ...state, language: action.data as string }
        case SET_THRESHOLD:
            return { ...state, threshold: action.data as number }
        case SET_STORAGE_CONFIGS:
            {
                let splits = (action.data as string).split('_', 3)
                let favSites: FavoriteSite[] = JSON.parse(splits[2])
                let favSiteSet = new Set<number>(favSites.map(x => x.centerId))
                return { ...state, threshold: +splits[0], interval: +splits[1], favoriteSite: favSites, favoriteSiteSet: favSiteSet }
            }
        case ADD_FAVORITE_SLOT: {
            let slot = action.data as SlotData
            let favoriteSite: FavoriteSite = { centerId: slot.centerId, siteName: slot.siteName, siteAddress: slot.siteAddress }
            return addFavoriteSlot(state, slot.centerId, favoriteSite);
        }
        case DEL_FAVORITE_SLOT: {
            let slot = action.data as SlotData
            return removeFavoriteSlot(state, slot.centerId);
        }
        case ADD_FAV_SITE: {
            let site = action.data as Site
            let favoriteSite: FavoriteSite = { ...site }
            return addFavoriteSlot(state, site.centerId, favoriteSite);
        }
        case DEL_FAV_SITE: {
            let site = action.data as Site
            return removeFavoriteSlot(state, site.centerId);
        }
        case DEL_EXISTING_FAVORITE_SLOT: {
            const site = action.data as FavoriteSite
            return removeFavoriteSlot(state, site.centerId)
        }
        case SET_SEARCH_RESULT:
            const searchResult = action.data as SearchResult
            return {...state, availableSlots: searchResult.slots, unavailableSites: searchResult.unavailableSites}

    }

    return state
}

export default reducer;

function removeFavoriteSlot(state: ApplicationState, centerId: number) {
    let favoriteSites = state.favoriteSite;
    if (favoriteSites) {
        favoriteSites = favoriteSites.filter(x => x.centerId !== centerId);
    }
    let favoriteSiteSet = state.favoriteSiteSet;
    if (favoriteSiteSet) {
        favoriteSiteSet.delete(centerId);
    }
    return { ...state, favoriteSite: favoriteSites, favoriteSiteSet: favoriteSiteSet };
}

function addFavoriteSlot(state: ApplicationState, centerId: number, favoriteSite: FavoriteSite) {
    let favoriteSites = state.favoriteSite;
    if (!favoriteSites) {
        favoriteSites = [];
    }
    let favoriteSiteSet = state.favoriteSiteSet;
    if (!favoriteSiteSet) {
        favoriteSiteSet = new Set();
    }
    if (!favoriteSiteSet.has(centerId)) {
        favoriteSites.push(favoriteSite);
        favoriteSiteSet.add(centerId);
    }
    return { ...state, favoriteSite: favoriteSites, favoriteSiteSet: favoriteSiteSet };
}
