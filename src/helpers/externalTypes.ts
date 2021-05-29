
export interface State {
    state_id: number,
    state_name: string,
}

export interface StateResponse {
    states: Array<State>
}

export interface District {
    district_id: number,
    district_name: string,
}

export interface DistrictResponse {
    districts: Array<State>
}

export interface VaccineSession {
    session_id: string,
    date: string, 
    available_capacity: number, 
    min_age_limit: number, 
    vaccine: string, 
    slots: Array<string>, 
    available_capacity_dose1: number, 
    available_capacity_dose2: number
}

export interface VaccineFee {
    vaccine: string,
    fee: string
}

export interface Center {
    center_id: number,
    name: string,
    address: string,
    state_name: string,
    district_name: string,
    block_name: string,
    pincode: number,
    lat: number,
    long: number,
    from: string,
    to: string,
    fee_type: string,
    sessions: Array<VaccineSession>,
    vaccine_fees: Array<VaccineFee>,
}

export interface CenterResponse {
    centers: Array<Center>
}