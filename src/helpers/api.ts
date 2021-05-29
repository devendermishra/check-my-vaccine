import { CenterResponse, DistrictResponse, StateResponse } from "./externalTypes"

export const baseUrl = 'https://cdn-api.co-vin.in/'

const getStateAPI = baseUrl + 'api/v2/admin/location/states'
const getDistrictAPI = baseUrl + 'api/v2/admin/location/districts/{stateId}'
const getByPinAPI = baseUrl + 'api/v2/appointment/sessions/public/calendarByPin?pincode={pinCode}&date={startDate}' //Date 27-05-2021
const getByDistrictAPI = baseUrl + 'api/v2/appointment/sessions/public/calendarByDistrict?district_id={districtId}&date={startDate}'

//const apiHeader = { ['User-Agent']: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36' }

type FetchParams = Parameters<typeof fetch>

async function api<T>(...params: FetchParams): Promise<T> {
    const response = await fetch(...params)
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    const json = response.json()
    console.log('DEVENDER response JSON ' + json)
    return await (json as Promise<T>)
}

export const getStates = ():Promise<StateResponse> =>  {
    return api(getStateAPI)
}

export const getDistricts = (stateId: number): Promise<DistrictResponse> => {
    return api(getDistrictAPI.replace('{stateId}', stateId.toString()))
}

export const getSlotsByPIN = (pinCode: number, startDate: string): Promise<CenterResponse> => {
    return api(getByPinAPI
        .replace('{pinCode}', pinCode.toString())
        .replace('{startDate}', startDate))
}

export const getByDistrict = (districtId: number, startDate: string): Promise<CenterResponse> => {
    return api(getByDistrictAPI
        .replace('{districtId}', districtId.toString())
        .replace('{startDate}', startDate))
}
