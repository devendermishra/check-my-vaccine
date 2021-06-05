
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
    lat?: number
    long?: number
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
    mode?: string
    status?: string
    availableSlots?: SlotData[]
    interval?: number
    language?: string
    threshold?: number
}

export interface Action {
    type: string,
    data: number|string|SlotData[]
}