import 'bootstrap/dist/css/bootstrap.min.css'
import './Page.css'
import { isMobile } from "react-device-detect"

import SearchFilter from './SearchFilter'
import WhenFinished from './WhenFinished'
import Result from './Result'
import { SlotData } from '../helpers/types'
import { useState } from 'react'

export const Page = () => {
    const pageClass = !isMobile ? "page" : "page-mobile"
    const [appState, setAppState] = useState('')
    const [slotData, setSlotData] = useState([] as Array<SlotData>)
    return (<div className={pageClass}>
        {!isMobile && <div className="row1">
            <SearchFilter setSlotData={setSlotData} setAppState={setAppState} />
        </div>}
        {!isMobile && <div className="row2">
            <WhenFinished {...appState}/>
            <Result slotData={slotData} appState={appState} />
        </div>}
        {isMobile && <div className="row1-mobile">
            <SearchFilter setSlotData={setSlotData} setAppState={setAppState} />
        </div>}
        {isMobile && <div className="row2-mobile">
            <Result slotData={slotData} appState={appState} />
            <WhenFinished {...appState} />
        </div>}
    </div>)
}

