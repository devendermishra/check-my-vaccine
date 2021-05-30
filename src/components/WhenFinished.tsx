import { AppState } from '../helpers/types'
import { DONE_STATE } from '../helpers/constants'

const WhenFinished = (appState: AppState) => {
    return (<>{appState.appState == DONE_STATE && <div>
        <p>Go to Cowin Website to book Slot</p>
        <p>Go to Aarogya Setu App</p>
        <p>Go to Umang App</p>
    </div>}</>)
}

export default WhenFinished