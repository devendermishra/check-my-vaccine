import {
    SELECT_AGE, SELECT_DISTRICT, SELECT_DOSE,
    SELECT_PINCODE, SELECT_STATE, SELECT_VACCINE, SELECT_WEEK
} from "./actions";
import { Action, ApplicationState } from "./types";


const intialState: ApplicationState = {}

const reducer = (state = intialState, action: Action): ApplicationState => {
    switch (action.type) {
        case SELECT_STATE:
            return { ...state, selectedState: action.data as number }
        case SELECT_DISTRICT:
            return { ...state, selectedDistrict: action.data as number, }
        case SELECT_PINCODE:
            return { ...state, selectedPin: action.data as number }
        case SELECT_DOSE:
            return { ...state, selectedDose: action.data as number }
        case SELECT_VACCINE:
            return { ...state, selectedVaccine: action.data as string }
        case SELECT_WEEK:
            return { ...state, selectedWeek: action.data as number }
        case SELECT_AGE:
            return { ...state, selectedAge: action.data as string }
    }

    return state
}

export default reducer;