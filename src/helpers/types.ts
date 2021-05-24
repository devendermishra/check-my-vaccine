
export type SlotData = {
    siteName: string,
    siteAddress: string,
    date: string,
    slotsAvailable: number,
    vaccine: string,
    dose: number
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