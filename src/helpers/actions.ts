import { Action, SlotData } from "./types"

export const SELECT_STATE = 'SELECT_STATE'
export const SELECT_DISTRICT = 'SELECT_DISTRICT'
export const SELECT_PINCODE = 'SELECT_PINCODE'
export const SELECT_VACCINE = 'SELECT_VACCINE'
export const SELECT_DOSE = 'SELECT_DOSE'
export const SELECT_WEEK = 'SELECT_WEEK'
export const SELECT_AGE = 'SELECT_AGE'
export const SET_MODE = 'SET_MODE'
export const SET_STATUS = 'SET_STATUS'
export const SET_SLOT = 'SET_SLOT'
export const SET_INTERVAL = 'SET_INTERVAL'
export const SET_LANGUAGE = 'SET_LANGUAGE'

export const selectState = (state: number): Action => ({ type: SELECT_STATE, data: state })
export const selectDistrict = (district: number): Action => ({ type: SELECT_DISTRICT, data: district })
export const selectPincode = (pincode: number): Action => ({ type: SELECT_PINCODE, data: pincode })
export const selectVaccine = (vaccine: string): Action => ({ type: SELECT_VACCINE, data: vaccine })
export const selectDose = (dose: number): Action => ({ type: SELECT_DOSE, data: dose })
export const selectWeek = (week: number): Action => ({ type: SELECT_WEEK, data: week })
export const selectAge = (age: number): Action => ({ type: SELECT_AGE, data: age })
export const setMode = (mode: string): Action => ({type: SET_MODE, data: mode})
export const setStatus = (status: string): Action => ({type: SET_STATUS, data: status})
export const setSlot = (slots: SlotData[]): Action => ({type: SET_SLOT, data: slots})
export const setPingInterval = (interval: number): Action => ({type: SET_INTERVAL, data: interval})
export const setLanguage = (langCode: string): Action => ({type: SET_LANGUAGE, data: langCode})