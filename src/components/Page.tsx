import 'bootstrap/dist/css/bootstrap.min.css'
import './Page.css'
import { isMobile } from "react-device-detect"
import SearchFilter from './SearchFilter'
import Result from './Result'
import { useEffect, useState } from 'react'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants'
import { useDispatch, useSelector } from 'react-redux'
import { checkSlots, monitorSlots, stopMonitoring } from '../helpers/timer'
import { setSlot } from '../helpers/actions'

export const Page = () => {
    const pageClass = !isMobile ? "page" : "page-mobile"
    const [appState, setAppState] = useState({ appState: '' })
    const applicationState = useSelector(a => a)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
          } else {
            Notification.requestPermission();
          }
    }, [])
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

