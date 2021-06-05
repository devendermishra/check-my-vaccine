import { ReactElement } from 'react'
import './Result.css'
import { ApplicationState, AppState } from '../helpers/types'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants'
import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table'
import { isMobile } from "react-device-detect"
import { _T, _TK } from '../helpers/multilang'

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
        {!appState && (<p style={{ color: 'blue' }}><b>{_T('CLICK_CHECK_SLOTS')}<br />
            {_T('CLICK_MONITOR_SLOTS')}
        </b></p>)}
        {(appState === WAITING_STATE && (<p style={{ color: 'blue' }}><b>
            {_TK('WAITING', {
                interval: '' + applicationState.interval + '-'
                    + (applicationState.interval! + 10)
            })}</b></p>))}
        {(appState === DONE_STATE
            && (!slotData || slotData.length <= 0)
            && (<p style={{ color: 'red' }}><b>{_T('NO_SLOTS')}</b></p>))}
        {(slotData && slotData.length !== 0 &&
            (<>
                <Table striped hover size="sm">
                    <thead key={'result-thead'}>
                        {!isMobile && <tr>
                            <th>{_T('SITE')}</th>
                            <th>{_T('ADDR')}</th>
                            <th>{_T('DATE')}</th>
                            <th>{_T('SLOTS')}</th>
                        </tr>}
                        {isMobile && <tr>
                            <th>{_T('SITE')}</th>
                            <th>{_T('ADDR')}</th>
                        </tr>}
                    </thead>
                    <tbody key={'result-tbody-data'}>
                        {!isMobile && slotData.map(slot => (<tr key={'result-' + slot.siteName + '-' + slot.date}>
                            <td key={'resultSite-' + slot.siteName + '-' + slot.date}>{slot.siteName}
                                <br />{_T('AGE')}: <b>{slot.age}</b>
                                <br />{_T('VACCINE')}: <b>{_T(slot.vaccine)}</b>
                                <br />{_T('FEE')}:
                                <b>{slot.vaccineFee ? slot.vaccineFee : _T('FREE')}</b>
                            </td>
                            <td key={'resultAddr-' + slot.siteName + '-' + slot.date}>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}
                                {(slot.lat && slot.long) && <a href=
                                    {'https://maps.google.com/?q=' + slot.lat + ',' + slot.long}>{_T('LOCATION')}</a>}
                            </td>
                            <td key={'resultDate-' + slot.siteName + '-' + slot.date}>{slot.date}</td>
                            <td key={'resultDose-' + slot.siteName + '-' + slot.date}>{slot.slotsAvailable}<br />
                                {_T('DOSE1')}: {slot.firstDose}<br />
                                {_T('DOSE2')}: {slot.secondDose}
                            </td>
                        </tr>))}
                        {isMobile && slotData.map(slot => (<tr key={'Mresult-' + slot.siteName + '-' + slot.date}>
                            <td key={'MresultSite-' + slot.siteName + '-' + slot.date}>{slot.siteName}
                                <br /> {_T('DATE')}: <b>{slot.date}</b>
                                <br />{_T('AGE')}: <b>{slot.age}</b>
                                <br />{_T('VACCINE')}: <b>{_T(slot.vaccine)}</b>
                                <br />{_T('FEE')}:
                                <b>{slot.vaccineFee ? slot.vaccineFee : _T('FREE')}</b>
                            </td>
                            <td key={'MresultAddr-' + slot.siteName + '-' + slot.date}>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}
                                {(slot.lat && slot.long) && <a href=
                                    {'https://maps.google.com/?q=' + slot.lat + ',' + slot.long}>{_T('LOCATION')}</a>}
                                <br />{_T('SLOTS')}: <b>{slot.slotsAvailable}</b>
                                <br />{_T('DOSE1')}: <b>{slot.firstDose}</b>
                                <br />{_T('DOSE2')}: <b>{slot.secondDose}</b>
                            </td>
                        </tr>))}
                    </tbody>
                </Table>
            </>))}
    </div>)
}

export default Result
