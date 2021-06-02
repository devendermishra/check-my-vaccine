import { CenterResponse, DistrictResponse, StateResponse } from "./externalTypes"

export const baseUrl = 'https://cdn-api.co-vin.in/'

const getStateAPI = baseUrl + 'api/v2/admin/location/states'
const getDistrictAPI = baseUrl + 'api/v2/admin/location/districts/{stateId}'
const getByPinAPI = baseUrl + 'api/v2/appointment/sessions/public/calendarByPin?pincode={pinCode}&date={startDate}' //Date 27-05-2021
const getByDistrictAPI = baseUrl + 'api/v2/appointment/sessions/public/calendarByDistrict?district_id={districtId}&date={startDate}'

type FetchParams = Parameters<typeof fetch>
async function api<T>(...params: FetchParams): Promise<T> {
    const response = await fetch(...params)
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    const json = response.json()
    return await (json as Promise<T>)
}

//Below is commented as not supported by CORS header.
/*const getLangHeader = () => {
    const currentLang = getSelectedLanguage()
    let lang = 'en_US'
    if (currentLang !== 'en') {
        lang = currentLang + '_IN'
    }
    return lang
}

const getHeader = (): RequestInit | undefined =>  {
    return { headers: { 'Accept-Language': getLangHeader() } }
}*/

export const getStates = (): Promise<StateResponse> => {
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
