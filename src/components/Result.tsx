import { ReactElement, useState } from 'react'
import './Result.css'
import { ApplicationState, AppState, Site, SlotData } from '../helpers/types'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants'
import { useDispatch, useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table'
import { isMobile } from "react-device-detect"
import { _T, _TK } from '../helpers/multilang'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import Button from '@material-ui/core/Button'
import { addFavSite, delFavSite, delFavSlot, setFavSlot } from '../helpers/actions'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

interface ResultProps {
    appState: AppState
}

const getSlots = (applicationState: ApplicationState) => {
    if (applicationState.availableSlots && applicationState.availableSlots.length > 0) {
        return applicationState.availableSlots
    }
    return []
}

const getUnavailableSlots = (applicationState: ApplicationState) => {
    if (applicationState.unavailableSites && applicationState.unavailableSites.length > 0) {
        return applicationState.unavailableSites
    }
    return []
}

const Result = (props: ResultProps): ReactElement => {
    const className = "result-mobile"
    const { appState } = props.appState
    const applicationState: ApplicationState = useSelector(applicationState => applicationState)
    const slotData = getSlots(applicationState)
    const unavailableSite = getUnavailableSlots(applicationState)

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
                <ResultTable slotData={slotData}
                    applicationState={applicationState}
                    unavailableSites={unavailableSite} />
            </>))}
    </div>)
}

const isFavoriteSlot = (slot: SlotData, favoriteSiteSet?: Set<number>) => {
    if (favoriteSiteSet) {
        return favoriteSiteSet.has(slot.centerId)
    }
    return false
}

const isFavoriteSite = (slot: Site, favoriteSiteSet?: Set<number>) => {
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

interface FavoriteSiteProperty {
    site: Site
    favoriteSiteSet?: Set<number>
}

const FavoriteSite = (props: FavoriteSiteProperty) => {
    const isFavorite = isFavoriteSite(props.site, props.favoriteSiteSet)
    const [state, setState] = useState(isFavorite)
    const dispatch = useDispatch()
    const removeFavorite = (site: Site) => {
        dispatch(delFavSite(site))
        setState(false)
    }
    const addFavorite = (site: Site) => {
        dispatch(addFavSite(site))
        setState(true)
    }

    return state ?
        (<Button size='small' variant="text" color="secondary" children={<FavoriteIcon color="primary" />}
            onClick={() => removeFavorite(props.site)}></Button>)
        :
        (<Button variant="text" size='small' color="primary" children={<FavoriteBorderIcon color="secondary" />}
            onClick={() => addFavorite(props.site)}></Button>)
}

export default Result

interface ResultTableProps {
    slotData: SlotData[]
    applicationState: ApplicationState
    unavailableSites: Site[]
}

interface AvailableSlotsProps {
    slotData: SlotData[]
    applicationState: ApplicationState
}

const ResultTable = (props: ResultTableProps) => {
    const [radioValue, setRadioValue] = useState('1')
    const radios = [
        { name: _T('AVAILABLE'), value: '1' },
        { name: _T('UNAVAILABLE'), value: '2' },
    ]
    const showUnavailable = radioValue === '2'
    const { slotData, applicationState } = props
    return <>
        <ButtonGroup toggle>
            {radios.map((radio, idx) => (
                <ToggleButton
                    key={idx}
                    type="checkbox"
                    variant="secondary"
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => {
                        setRadioValue(e.currentTarget.value)

                    }}>
                    {radio.name}
                </ToggleButton>
            ))}
        </ButtonGroup>
        {!showUnavailable && (<AvailableSlotsTable
            slotData={slotData} applicationState={applicationState} />)}
        {showUnavailable && (<UnavailableSite {...props} />)}
    </>
}

const AvailableSlotsTable = (props: AvailableSlotsProps) => {
    const { slotData, applicationState } = props
    return <Table striped hover size="sm">
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
                    {(slot.lat && slot.long) && <a href={'https://maps.google.com/?q=' + slot.lat + ',' + slot.long}>{_T('LOCATION')}</a>}
                </td>
                <td>{slot.date}</td>
                <td>{slot.slotsAvailable}<br />
                    {_T('DOSE1')}: {slot.firstDose}<br />
                    {_T('DOSE2')}: {slot.secondDose}
                </td>
            </tr>))}
            {isMobile && slotData.map(slot => (<tr key={'Mresult-' + slot.sessionId}>
                <td>{slot.siteName}
                    &nbsp;&nbsp;<FavoriteSlot slot={slot} favoriteSiteSet={applicationState.favoriteSiteSet} />
                    <br /> {_T('DATE')}: <b>{slot.date}</b>
                    <br />{_T('AGE')}: <b>{slot.age}</b>
                    <br />{_T('VACCINE')}: <b>{_T(slot.vaccine)}</b>
                    <br />{_T('FEE')}:
                    <b>{slot.vaccineFee ? slot.vaccineFee : _T('FREE')}</b>
                </td>
                <td>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}
                    {(slot.lat && slot.long) && <a href={'https://maps.google.com/?q=' + slot.lat + ',' + slot.long}>{_T('LOCATION')}</a>}
                    <br />{_T('SLOTS')}: <b>{slot.slotsAvailable}</b>
                    <br />{_T('DOSE1')}: <b>{slot.firstDose}</b>
                    <br />{_T('DOSE2')}: <b>{slot.secondDose}</b>
                </td>
            </tr>))}
        </tbody>
    </Table>
}

const UnavailableSite = (props: ResultTableProps) => {
    const { unavailableSites, applicationState } = props
    return <Table striped hover size="sm">
        <thead key={'result-thead'}>
            <tr>
                <th>{_T('SITE')}</th>
                <th>{_T('ADDR')}</th>
            </tr>
        </thead>
        <tbody key={'result-tbody-data'}>
            {unavailableSites.map(slot => (<tr key={'Munavailableresult-' + slot.centerId}>
                <td>{slot.siteName} <FavoriteSite site={slot}
                favoriteSiteSet={applicationState.favoriteSiteSet}/></td>
                <td>{slot.siteAddress.split('\n').map(text => (<>{text}<br /></>))}</td>
            </tr>))}
        </tbody>
    </Table>
}
