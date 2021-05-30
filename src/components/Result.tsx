import { ReactElement } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Result.css'
import { ApplicationState, AppState } from '../helpers/types'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants'
import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table'
import { isMobile } from "react-device-detect"

interface ResultProps {
    appState: AppState
}

const getSlots = (applicationState: ApplicationState) => {
    if (applicationState.availableSlots && applicationState.availableSlots.length > 0) {
        return applicationState.availableSlots
    }
    return []
}

const Result = (props: ResultProps): ReactElement => {
    const className = "result-mobile"
    const { appState } = props.appState
    const applicationState: ApplicationState = useSelector(applicationState => applicationState)
    const slotData = getSlots(applicationState)
    return (<div className={className}>
        {!appState && (<p style={{ color: 'blue' }}><b>Click 'Check Slot' to query slots.<br />
        Click 'Monitor Slot' to monitor free slots.</b></p>)}
        {(appState === WAITING_STATE && (<p style={{ color: 'blue' }}><b>Waiting. Querying
            every {applicationState.interval} seconds.</b></p>))}
        {(appState === DONE_STATE
            && (!slotData || slotData.length <= 0)
            && (<p style={{ color: 'red' }}><b>No Slots available</b></p>))}
        {(slotData && slotData.length !== 0 &&
            (<>
                <Table striped hover size="sm">
                    <thead>
                        {!isMobile && <tr>
                            <th>Site</th>
                            <th>Address</th>
                            <th>Date</th>
                            <th>Slots</th>
                        </tr>}
                        {isMobile && <tr>
                            <th>Site</th>
                            <th>Address</th>
                        </tr>}
                    </thead>
                    <tbody>
                        {!isMobile && slotData.map(slot => (<tr>
                            <td>{slot.siteName}
                                <br />Age: <b>{slot.age}</b>
                                <br />Vaccine: <b>{slot.vaccine}</b>
                                <br />Fee (if any):
                                <b>{slot.vaccineFee ? slot.vaccineFee : 'Free'}</b>
                            </td>
                            <td>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}
                                {(slot.lat && slot.long) && <a href=
                                    {'https://maps.google.com/?q=' + slot.lat + ',' + slot.long}>Location</a>}
                            </td>
                            <td>{slot.date}</td>
                            <td>{slot.slotsAvailable}<br />
                            Dose 1: {slot.firstDose}<br />
                            Dose 2: {slot.secondDose}
                            </td>
                        </tr>))}
                        {isMobile && slotData.map(slot => (<tr>
                            <td>{slot.siteName}
                                <br /> Date: <b>{slot.date}</b>
                                <br />Age: <b>{slot.age}</b>
                                <br />Vaccine: <b>{slot.vaccine}</b>
                                <br />Fee (if any):
                                <b>{slot.vaccineFee ? slot.vaccineFee : 'Free'}</b>
                            </td>
                            <td>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}
                                {(slot.lat && slot.long) && <a href=
                                    {'https://maps.google.com/?q=' + slot.lat + ',' + slot.long}>Location</a>}
                                <br />Slots: <b>{slot.slotsAvailable}</b>
                                <br />Dose 1: <b>{slot.firstDose}</b>
                                <br />Dose 2: <b>{slot.secondDose}</b>
                            </td>
                        </tr>))}
                    </tbody>
                </Table>
            </>))}
    </div>)
}

export default Result
