import { Action } from "./types"

export const SELECT_STATE = 'SELECT_STATE'
export const SELECT_DISTRICT = 'SELECT_DISTRICT'
export const SELECT_PINCODE = 'SELECT_PINCODE'
export const SELECT_VACCINE = 'SELECT_VACCINE'
export const SELECT_DOSE = 'SELECT_DOSE'
export const SELECT_WEEK = 'SELECT_WEEK'
export const SELECT_AGE = 'SELECT_AGE'
export const SET_MODE = 'SET_MODE'

export const selectState = (state: number): Action => ({ type: SELECT_STATE, data: state })
export const selectDistrict = (district: number): Action => ({ type: SELECT_DISTRICT, data: district })
export const selectPincode = (pincode: number): Action => ({ type: SELECT_PINCODE, data: pincode })
export const selectVaccine = (vaccine: string): Action => ({ type: SELECT_VACCINE, data: vaccine })
export const selectDose = (dose: number): Action => ({ type: SELECT_DOSE, data: dose })
export const selectWeek = (week: number): Action => ({ type: SELECT_WEEK, data: week })
export const selectAge = (age: string): Action => ({ type: SELECT_AGE, data: age })
export const setMode = (mode: string): Action => ({type: SET_MODE, data: mode})