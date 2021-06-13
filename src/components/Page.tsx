import './Page.css'
import { isMobile } from "react-device-detect"
import SearchFilter from './SearchFilter'
import Result from './Result'
import { useEffect, useState } from 'react'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants'
import { useDispatch, useSelector } from 'react-redux'
import { checkFavSlots, checkSlots, monitorFavSlots, monitorSlots, stopMonitoring } from '../helpers/timer'
import { setSearchResult } from '../helpers/actions'
import { selectLanguage } from '../helpers/multilang'
import { ApplicationState } from '../helpers/types'


export const Page = () => {
    const pageClass = !isMobile ? "page" : "page-mobile"
    const [appState, setAppState] = useState({ appState: '' })
    const applicationState = useSelector(a => a) as ApplicationState
    const dispatch = useDispatch()
    useEffect(() => {
        const langCode = localStorage.getItem('preferred_lang')
        if (langCode) {
            selectLanguage(langCode)
        }
    }, [dispatch])

    const checkSlotCallback = () => {
        checkSlots(applicationState, (slots) => {
            setAppState({ appState: DONE_STATE })
            dispatch(setSearchResult(slots))
        })
    }

    const checkFavSlotCallback = () => {
        checkFavSlots(applicationState, (slots) => {
            setAppState({ appState: DONE_STATE })
            dispatch(setSearchResult(slots))
        })
    }

    const monitorSlotsCallback = (completionCallback: () => void) => {
        monitorSlots(applicationState, (slots) => {
            setAppState({ appState: DONE_STATE })
            dispatch(setSearchResult(slots))
            completionCallback()
        }, () => {
            setAppState({ appState: WAITING_STATE })
        })
    }

    const monitorFavSlotsCallback = (completionCallback: () => void) => {
        monitorFavSlots(applicationState, (slots) => {
            setAppState({ appState: DONE_STATE })
            dispatch(setSearchResult(slots))
            completionCallback()
        }, () => {
            setAppState({ appState: WAITING_STATE })
        })
    }

    const resetMonitorCallback = () => {
        stopMonitoring(() => {
            setAppState({ appState: '' })
        })
    }

    return (<div className={pageClass}>
        <div className="row1-mobile">
            <SearchFilter setAppState={setAppState}
                checkSlotsCB={checkSlotCallback}
                checkFavSlotCB={checkFavSlotCallback}
                monitorFavSlotsCB={monitorFavSlotsCallback}
                monitorSlotsCB={monitorSlotsCallback}
                stopMonitorCB={resetMonitorCallback} />
        </div>
        <div className="row2-mobile">
            <Result appState={appState} />
        </div>
    </div>)
}

