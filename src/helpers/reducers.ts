import {
    ADD_FAVORITE_SLOT,
    DEL_EXISTING_FAVORITE_SLOT,
    DEL_FAVORITE_SLOT,
    SELECT_AGE, SELECT_DISTRICT, SELECT_DOSE,
    SELECT_PINCODE, SELECT_STATE, SELECT_VACCINE, SELECT_WEEK, SET_INTERVAL, SET_LANGUAGE, SET_MODE, SET_SLOT, SET_STORAGE_CONFIGS, SET_THRESHOLD
} from "./actions";
import { Action, ApplicationState, FavoriteSite, SlotData } from "./types";


const intialState: ApplicationState = { interval: 5, threshold: 1, favoriteSite: [], favoriteSiteSet: new Set() }

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
            let favoriteSites = state.favoriteSite
            if (!favoriteSites) {
                favoriteSites = []
            }
            let favoriteSiteSet = state.favoriteSiteSet
            if (!favoriteSiteSet) {
                favoriteSiteSet = new Set()
            }
            if (!favoriteSiteSet.has(slot.centerId)) {
                favoriteSites.push(favoriteSite)
                favoriteSiteSet.add(slot.centerId)
            }
            localStorage.setItem('fav_sites', JSON.stringify(favoriteSites))
            return { ...state, favoriteSite: favoriteSites, favoriteSiteSet: favoriteSiteSet }
        }
        case DEL_FAVORITE_SLOT: {
            let slot = action.data as SlotData
            let favoriteSites = state.favoriteSite
            if (favoriteSites) {
                favoriteSites = favoriteSites.filter(x => x.centerId !== slot.centerId)
            }
            let favoriteSiteSet = state.favoriteSiteSet
            if (favoriteSiteSet) {
                favoriteSiteSet.delete(slot.centerId)
            }
            localStorage.setItem('fav_sites', JSON.stringify(favoriteSites))
            return { ...state, favoriteSite: favoriteSites, favoriteSiteSet: favoriteSiteSet }
        }
        
        case DEL_EXISTING_FAVORITE_SLOT: {
            const site = action.data as FavoriteSite
            let favoriteSites = state.favoriteSite
            if (favoriteSites) {
                favoriteSites = favoriteSites.filter(x => x.centerId !== site.centerId)
            }
            let favoriteSiteSet = state.favoriteSiteSet
            if (favoriteSiteSet) {
                favoriteSiteSet.delete(site.centerId)
            }
            localStorage.setItem('fav_sites', JSON.stringify(favoriteSites))
            return { ...state, favoriteSite: favoriteSites, favoriteSiteSet: favoriteSiteSet }
        }

    }

    return state
}

export default reducer;