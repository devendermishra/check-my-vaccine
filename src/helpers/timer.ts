import { getByDistrict, getSlotsByPIN } from "./api"
import { DISTRICT_MODE, PINCODE_MODE } from "./constants"
import { CenterResponse, VaccineSession } from "./externalTypes"
import { ApplicationState, SlotData } from "./types"

let timer: any = null

export const monitorSlots = (applicationState: ApplicationState,
    callback: (slots: SlotData[]) => void,
    startCallback: () => void) => {
        const interval = applicationState.interval!
    if (applicationState.mode === PINCODE_MODE && validatePincodeInput(applicationState)) {
        startCallback()
        timer = setInterval(() => monitorPincode(applicationState, callback), interval*1000)
    } else if(applicationState.mode === DISTRICT_MODE && validateDistrictInput(applicationState)) {
        startCallback()
        timer = setInterval(() => monitorDistrict(applicationState, callback), interval*1000)
    }
}

export const stopMonitoring = (callback: () => void) => {
    clearInterval(timer)
    callback()
}

export const checkSlots = (applicationState: ApplicationState,
    callback: (slots: SlotData[]) => void) => {
    if (applicationState.mode === PINCODE_MODE && validatePincodeInput(applicationState)) {
        checkPincode(applicationState, callback)
    } else if((!applicationState.mode || applicationState.mode === DISTRICT_MODE) 
    && validateDistrictInput(applicationState)) {
        checkDistrict(applicationState, callback)
    }
}

const validatePincodeInput = (applicationState: ApplicationState): boolean => {
    return applicationState.selectedPin !== undefined
}

const validateDistrictInput = (appliactionState: ApplicationState): boolean => {
    return appliactionState.selectedDistrict !== undefined
}

const monitorPincode = (applicationState: ApplicationState, callback: (slots: SlotData[]) => void) => {
    const pinCode = applicationState.selectedPin!
    const startDate = getDate(applicationState.selectedWeek !== undefined ?
        applicationState.selectedWeek : 1)
    getSlotsByPIN(pinCode, startDate).then(centerFilterPromise(applicationState, callback))
}

const monitorDistrict = (applicationState: ApplicationState, callback: (slots: SlotData[]) => void) => {
    const districtId = applicationState.selectedDistrict!
    const startDate = getDate(applicationState.selectedWeek !== undefined ?
        applicationState.selectedWeek : 1)
    getByDistrict(districtId, startDate).then(centerFilterPromise(applicationState, callback))
}

const checkPincode = (applicationState: ApplicationState, callback: (slots: SlotData[]) => void) => {
    const pinCode = applicationState.selectedPin!
    const startDate = getDate(applicationState.selectedWeek !== undefined ?
        applicationState.selectedWeek : 1)
    getSlotsByPIN(pinCode, startDate).then(centerFilterCheckPromise(applicationState, callback))
}

const checkDistrict = (applicationState: ApplicationState, callback: (slots: SlotData[]) => void) => {
    const districtId = applicationState.selectedDistrict!
    const startDate = getDate(applicationState.selectedWeek !== undefined ?
        applicationState.selectedWeek : 1)
    getByDistrict(districtId, startDate).then(centerFilterCheckPromise(applicationState, callback))
}


const findMatch = (centers: CenterResponse, applicationState: ApplicationState): Array<SlotData> => {
    const slotData: Array<SlotData> = []
    centers.centers.forEach(vaccineCenter => {
        vaccineCenter.sessions.forEach(session => {
            if (session.available_capacity > 0) {
                let isMatch = matchDose(session, applicationState.selectedDose)
                    && matchVaccine(session, applicationState.selectedVaccine)
                    && matchAge(session, applicationState.selectedAge)
                if (isMatch) {
                    const vaccineFees = vaccineCenter.vaccine_fees ? vaccineCenter
                        .vaccine_fees
                        .filter(x => x.vaccine === session.vaccine)
                        .map(x => x.fee) : []
                    let vaccineCost: string = ''
                    if (vaccineFees.length > 0) {
                        vaccineCost = vaccineFees[0]
                    }
                    slotData.push({
                        siteName: vaccineCenter.name,
                        siteAddress: vaccineCenter.address + '\n' + vaccineCenter.district_name
                            + '\n' + vaccineCenter.state_name + ' - ' + vaccineCenter.pincode,
                        date: session.date,
                        slotsAvailable: session.available_capacity,
                        vaccine: session.vaccine,
                        firstDose: session.available_capacity_dose1,
                        secondDose: session.available_capacity_dose2,
                        age: getAge(applicationState.selectedAge ? applicationState.selectedAge : session.min_age_limit),
                        feeType: vaccineCenter.fee_type,
                        vaccineFee: vaccineCost,
                        lat: vaccineCenter.lat,
                        long: vaccineCenter.long
                    })
                }
            }
        })
    });
    return slotData.sort((a,b) => compareDate(a.date, b.date))
}

const compareDate = (date1: string, date2: string): number => {
    const part1 = date1.split('-')
    const part2 = date2.split('-')
    let comp = part1[2].localeCompare(part2[2])
    if (comp) {
        return comp
    }
    comp = part1[1].localeCompare(part2[1])
    if (comp) {
        return comp
    }
    return part1[0].localeCompare(part2[0])
}

const getAge = (age: number) => {
    if (age === 18) {
        return '18-44'
    }
    return '' + age + '+'
}

const getDate = (week: number) => {
    const currentDate = new Date()
    const targetDate = week >= 1 ? new Date(currentDate.getTime() + (week - 1) * 7 * 24 * 60 * 60) : currentDate
    return '' + targetDate.getDate() + '-' + (targetDate.getMonth() + 1) + '-' + targetDate.getFullYear()
}

const centerFilterCheckPromise = (applicationState: ApplicationState,
    callback: (slots: SlotData[]) => void): ((value: CenterResponse) => 
    void | PromiseLike<void>) | null | undefined => {
    return (centers: CenterResponse) => {
        const matchedSlots = findMatch(centers, applicationState)
        callback(matchedSlots)
    }
}

function centerFilterPromise(applicationState: ApplicationState, callback: (slots: SlotData[]) => void): ((value: CenterResponse) => void | PromiseLike<void>) | null | undefined {
    return (centers: CenterResponse) => {
        const matchedSlots = findMatch(centers, applicationState)
        if (matchedSlots.length > 0) {
            callback(matchedSlots)
            clearInterval(timer)
        }
    }
}

function matchDose(session: VaccineSession, selectedDose: number | undefined) {
    return !selectedDose
        || ((selectedDose === 1) ? (session.available_capacity_dose1 > 0)
            : (session.available_capacity_dose2 > 0))
}


function matchVaccine(session: VaccineSession, selectedVaccine: string | undefined) {
    return !selectedVaccine
        || (session.vaccine.toLowerCase() === selectedVaccine.toLowerCase())
}


function matchAge(session: VaccineSession, selectedAge: number | undefined) {
    return !selectedAge
        || (selectedAge >= session.min_age_limit)
}
