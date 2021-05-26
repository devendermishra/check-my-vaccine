import { mapToList, intToSelectionList, range } from './commons'

export const vaccineTypes: Record<number, string> = {
    1: "Covishield",
    2: "Covaxin",
    3: "Sputnik V"
}

export const ageTypes: Record<number, string> = { 1: "18+", 2: "45+" }

export const availableVaccines = mapToList(vaccineTypes)
export const ageGroups = mapToList(ageTypes)


export const doses = range(1, 2 + 1, 1).map(intToSelectionList)
export const weeks = range(1, 18 + 1, 1).map(intToSelectionList)

export const PINCODE_MODE = 'pincode'
export const DISTRICT_MODE = 'district'