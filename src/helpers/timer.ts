import { getByDistrict, getSlotsByPIN } from "./api"
import { DISTRICT_MODE, PINCODE_MODE } from "./constants"
import { CenterResponse, VaccineSession } from "./externalTypes"
import { ApplicationState, SlotData } from "./types"

//Variable timer interface to change time.
interface VariableTimer {
    running: boolean
    iv: number
    timeout?: NodeJS.Timeout
    cb: () => void
    start: (callback: () => void, iv: number) => void
    execute: (varTimer: VariableTimer) => void
    stop: () => void
    setInterval: (iv: number) => void
}

var varTimer: VariableTimer = {
    running: false,
    iv: 5000,
    timeout: undefined,
    cb: () => { },
    start: function (cb: () => void, iv: number) {
        var elm = this;
        this.running = true;
        this.cb = cb;
        this.iv = iv;
        this.timeout = setTimeout(function () { elm.execute(elm) }, this.iv);
    },
    execute: function (e) {
        if (e.running) {
            //To run in the loop, it assumes that start/setInterval is being called
            //inside the callback. Else, it will behave same setTimeout.
            e.cb();
        }
    },

    stop: function () {
        this.running = false;
    },
    setInterval: function (iv) {
        this.start(this.cb, iv);
    }
};

export const monitorSlots = (applicationState: ApplicationState,
    callback: (slots: SlotData[]) => void,
    startCallback: () => void) => {
    const interval = applicationState.interval!
    if (applicationState.mode === PINCODE_MODE && validatePincodeInput(applicationState)) {
        startCallback()
        varTimer.start(() => monitorPincode(applicationState, callback), interval * 1000)
    } else if (applicationState.mode === DISTRICT_MODE && validateDistrictInput(applicationState)) {
        startCallback()
        varTimer.start(() => monitorDistrict(applicationState, callback), interval * 1000)
    }
}

export const stopMonitoring = (callback: () => void) => {
    varTimer.stop()
    callback()
}

export const checkSlots = (applicationState: ApplicationState,
    callback: (slots: SlotData[]) => void) => {
    if (applicationState.mode === PINCODE_MODE && validatePincodeInput(applicationState)) {
        checkPincode(applicationState, callback)
    } else if ((!applicationState.mode || applicationState.mode === DISTRICT_MODE)
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

const monitorPincode = async (applicationState: ApplicationState, callback: (slots: SlotData[]) => void) => {
    const pinCode = applicationState.selectedPin!
    const startDate = getDate(applicationState.selectedWeek !== undefined ?
        applicationState.selectedWeek : 1)
    const delayInterval = Math.floor((Math.random() * 10)) * 1000 + applicationState.interval! * 1000
    getSlotsByPIN(pinCode, startDate).then(centerFilterPromise(applicationState, callback))
    varTimer.setInterval(delayInterval)
}

const monitorDistrict = async (applicationState: ApplicationState, callback: (slots: SlotData[]) => void) => {
    const districtId = applicationState.selectedDistrict!
    const startDate = getDate(applicationState.selectedWeek !== undefined ?
        applicationState.selectedWeek : 1)
    const delayInterval = Math.floor((Math.random() * 10)) * 1000 + applicationState.interval! * 1000
    getByDistrict(districtId, startDate)
        .then(centerFilterPromise(applicationState, callback))
    varTimer.setInterval(delayInterval)
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
    const threshold = applicationState.threshold ? applicationState.threshold : 1
    centers.centers.forEach(vaccineCenter => {
        vaccineCenter.sessions.forEach(session => {
            if (session.available_capacity >= threshold) {
                let isMatch = matchThreshold(session, threshold, applicationState.selectedDose)
                    && matchDose(session, applicationState.selectedDose)
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
                        age: getAge(applicationState.selectedAge ? applicationState.selectedAge : session.min_age_limit),
                        feeType: vaccineCenter.fee_type,
                        vaccineFee: vaccineCost,
                        lat: vaccineCenter.lat,
                        sessionId: session.session_id,
                        long: vaccineCenter.long,
                        centerId: vaccineCenter.center_id
                    })
                }
            }
        })
    });
    return slotData.sort((a, b) => compareDate(a.date, b.date))
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
    const targetDate = week > 1 ? new Date(currentDate.getTime() +
        (week - 1) * 7 * 24 * 60 * 60 * 1000) : currentDate
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
            varTimer.stop()
        }
    }
}

function matchDose(session: VaccineSession, selectedDose: number | undefined) {
    return !selectedDose
        || ((selectedDose === 1) ? (session.available_capacity_dose1 > 0)
            : (session.available_capacity_dose2 > 0))
}

const matchThreshold = (session: VaccineSession, threshold: number,
    selectedDose: number | undefined) => {
    if (selectedDose) {
        if (selectedDose === 1) {
            return session.available_capacity_dose1 >= threshold
        } else {
            return session.available_capacity_dose2 >= threshold
        }
    }

    return session.available_capacity >= threshold
}

function matchVaccine(session: VaccineSession, selectedVaccine: string | undefined) {
    return !selectedVaccine || selectedVaccine === 'ALL'
        || (session.vaccine.toLowerCase() === selectedVaccine.toLowerCase())
}


function matchAge(session: VaccineSession, selectedAge: number | undefined) {
    return !selectedAge || selectedAge === 0
        || (selectedAge === session.min_age_limit)
}
