
export type SlotData = {
    siteName: string
    siteAddress: string
    date: string
    slotsAvailable: number
    vaccine: string
    firstDose: number
    secondDose: number
    age: string
    feeType: string
    vaccineFee?: string
    centerId: number
    sessionId: string
    lat?: number
    long?: number
}

export type FavoriteSite = {
    centerId: number
    siteName: string
    siteAddress: string
}

export type Site = {
    centerId: number
    siteName: string
    siteAddress: string
}

export type AppState = {
    appState: string
}

export type SelectElement = {
    id: number,
    name: string
}

export type SearchInput = {
    stateId?: number,
    districtId?: number,
    pincode?: number,
    week?: number,
    vaccine?: string,
    dose?: number
}

export interface ApplicationState {
    selectedState?: number
    selectedDistrict?: number
    selectedPin?: number
    selectedDose?: number
    selectedVaccine?: string
    selectedWeek?: number
    selectedAge?: number
    free?: string
    mode?: string
    status?: string
    availableSlots?: SlotData[]
    unavailableSites?: Site[]
    interval?: number
    language?: string
    threshold?: number
    favoriteSite?: FavoriteSite[]
    favoriteSiteSet?: Set<number>
}

export interface SearchResult {
    slots: SlotData[]
    unavailableSites: Site[]
}

export interface Action {
    type: string,
    data: number | string | SlotData | SlotData[] | FavoriteSite | Site[] | SearchResult
}