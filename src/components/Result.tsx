import { ReactElement, useState } from 'react'
import './Result.css'
import { ApplicationState, AppState, SlotData } from '../helpers/types'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants'
import { useDispatch, useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table'
import { isMobile } from "react-device-detect"
import { _T, _TK } from '../helpers/multilang'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import Button from '@material-ui/core/Button'
import { delFavSlot, setFavSlot } from '../helpers/actions'

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
                        {!isMobile && slotData.map(slot => (<tr key={slot.sessionId}>
                            <td>{slot.siteName}
                            &nbsp;&nbsp;<FavoriteSlot slot={slot} favoriteSiteSet={applicationState.favoriteSiteSet} />
                                <br />{_T('AGE')}: <b>{slot.age}</b>
                                <br />{_T('VACCINE')}: <b>{_T(slot.vaccine)}</b>
                                <br />{_T('FEE')}:
                                <b>{slot.vaccineFee ? slot.vaccineFee : _T('FREE')}</b>
                            </td>
                            <td>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}
                                {(slot.lat && slot.long) && <a href=
                                    {'https://maps.google.com/?q=' + slot.lat + ',' + slot.long}>{_T('LOCATION')}</a>}
                            </td>
                            <td>{slot.date}</td>
                            <td>{slot.slotsAvailable}<br />
                                {_T('DOSE1')}: {slot.firstDose}<br />
                                {_T('DOSE2')}: {slot.secondDose}
                            </td>
                        </tr>))}
                        {isMobile && slotData.map(slot => (<tr key={'Mresult-' + slot.sessionId}>
                            <td>{slot.siteName}
                                <br /> {_T('DATE')}: <b>{slot.date}</b>
                                <br />{_T('AGE')}: <b>{slot.age}</b>
                                <br />{_T('VACCINE')}: <b>{_T(slot.vaccine)}</b>
                                <br />{_T('FEE')}:
                                <b>{slot.vaccineFee ? slot.vaccineFee : _T('FREE')}</b>
                            </td>
                            <td>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}
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

const isFavoriteSlot = (slot: SlotData, favoriteSiteSet?: Set<number>) => {
    if (favoriteSiteSet) {
        return favoriteSiteSet.has(slot.centerId)
    }
    return false
}

interface FavoriteSlotProperty {
    slot: SlotData
    favoriteSiteSet?: Set<number>
}

const FavoriteSlot = (props: FavoriteSlotProperty) => {
    const isFavorite = isFavoriteSlot(props.slot, props.favoriteSiteSet)
    const [state, setState] = useState(isFavorite)
    const dispatch = useDispatch()
    const removeFavorite = (slot: SlotData) => {
        dispatch(delFavSlot(slot))
        setState(false)
    }
    const addFavorite = (slot: SlotData) => {
        dispatch(setFavSlot(slot))
        setState(true)
    }

    return state ?
        (<Button size='small' variant="text" color="secondary" children={<FavoriteIcon color="primary" />}
            onClick={() => removeFavorite(props.slot)}></Button>)
        :
        (<Button variant="text" size='small' color="primary" children={<FavoriteBorderIcon color="secondary" />}
            onClick={() => addFavorite(props.slot)}></Button>)
}

export default Result
