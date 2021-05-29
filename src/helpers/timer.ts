import { getSlotsByPIN } from "./api"
import { DONE_STATE, PINCODE_MODE } from "./constants"
import { CenterResponse, VaccineSession } from "./externalTypes"
import { ApplicationState, SlotData } from "./types"


export const startMonitoring = (applicationState: ApplicationState,
    interval: number,
    setSlotData: React.Dispatch<React.SetStateAction<SlotData[]>>,
    setAppState: React.Dispatch<React.SetStateAction<string>>) => {
        if (applicationState.mode === PINCODE_MODE && validatePincodeInput(applicationState)) {
            monitorPincode(applicationState, setSlotData, setAppState)
            //setInterval(() => monitorPincode(applicationState, setSlotData, setAppState), interval*1000)
        }
}

const validatePincodeInput = (applicationState: ApplicationState): boolean => {
    return applicationState.selectedPin !== undefined
}

const monitorPincode = (applicationState: ApplicationState,
    setSlotData: React.Dispatch<React.SetStateAction<SlotData[]>>,
    setAppState: React.Dispatch<React.SetStateAction<string>>) => {
    const pinCode = applicationState.selectedPin!
    const startDate = getDate(applicationState.selectedWeek !== undefined ?
        applicationState.selectedWeek : 1)
    getSlotsByPIN(pinCode, startDate).then((centers: CenterResponse) => {
        const matchedSlots = findMatch(centers, applicationState)
        if (matchedSlots.length > 0) {
            setSlotData(matchedSlots)
            //setAppState(DONE_STATE)
        }
    })
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
                        siteAddress: vaccineCenter.address,
                        date: session.date,
                        slotsAvailable: session.available_capacity,
                        vaccine: session.vaccine,
                        firstDose: session.available_capacity_dose1,
                        secondDose: session.available_capacity_dose2,
                        age: '' + (applicationState.selectedAge ? applicationState.selectedAge : session.min_age_limit) + '+',
                        feeType: vaccineCenter.fee_type,
                        vaccineFee: vaccineCost
                    })
                }
            }
        })
    });
    return slotData
}

const getDate = (week: number) => {
    const currentDate = new Date()
    const targetDate = week >= 1 ? new Date(currentDate.getTime() + (week - 1)*7*24*60*60) : currentDate
    return '' + targetDate.getDate() + '-' + (targetDate.getMonth() + 1) + '-' + targetDate.getFullYear()
}

function matchDose(session: VaccineSession, selectedDose: number | undefined) {
    return !selectedDose 
    || (selectedDose === 1) ? (session.available_capacity_dose1 > 0)
    : (session.available_capacity_dose2 > 0)  
}


function matchVaccine(session: VaccineSession, selectedVaccine: string | undefined) {
    return !selectedVaccine
    || (session.vaccine.toLowerCase() === selectedVaccine.toLowerCase())
}


function matchAge(session: VaccineSession, selectedAge: number | undefined) {
    return !selectedAge
    || (selectedAge >= session.min_age_limit)
}
