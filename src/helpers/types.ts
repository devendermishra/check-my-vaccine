
export type SlotData = {
    siteName: string,
    siteAddress: string,
    date: string,
    slotsAvailable: number,
    vaccine: string,
    firstDose: number,
    secondDose: number,
    age: string,
    feeType: string,
    vaccineFee?: string,
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
    selectedState?: number,
    selectedDistrict?: number,
    selectedPin?: number,
    selectedDose?: number,
    selectedVaccine?: string,
    selectedWeek?: number,
    selectedAge?: number,
    mode?: string,
    status?: string,
}

export interface Action {
    type: string,
    data: any
}