import './Page.css'
import { isMobile } from "react-device-detect"
import SearchFilter from './SearchFilter'
import Result from './Result'
import { useEffect, useState } from 'react'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants'
import { useDispatch, useSelector } from 'react-redux'
import { checkSlots, monitorSlots, stopMonitoring } from '../helpers/timer'
import { setConfigs, setPingInterval, setSlot, setThreshold } from '../helpers/actions'
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
        let interval = localStorage.getItem('preferred_interval')
        let intervalValue = 5
        if (interval) {
            intervalValue = parseInt(interval)
        }
        let threshold = localStorage.getItem('min_threshold')
        let thresholdValue = 1
        if (threshold) {
            thresholdValue = parseInt(threshold)
        }
        if (isNaN(intervalValue)) {
            intervalValue = 5
        }
        if (isNaN(thresholdValue)) {
            thresholdValue = 1
        }
        dispatch(setConfigs(thresholdValue, intervalValue))
    }, [dispatch])
    const checkSlotCallback = () => {
        checkSlots(applicationState, (slots) => {
            setAppState({ appState: DONE_STATE })
            dispatch(setSlot(slots))
        })
    }

    const monitorSlotsCallback = (completionCallback: () => void) => {
        monitorSlots(applicationState, (slots) => {
            setAppState({ appState: DONE_STATE })
            dispatch(setSlot(slots))
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
                monitorSlotsCB={monitorSlotsCallback}
                stopMonitorCB={resetMonitorCallback} />
        </div>
        <div className="row2-mobile">
            <Result appState={appState} />
        </div>
    </div>)
}

