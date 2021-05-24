import { ReactElement } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Result.css'
import { isMobile } from "react-device-detect"
import {SlotData} from '../helpers/types'


const Result = (slot_data: Array<SlotData>) : ReactElement => {
    const className = !isMobile ? "result" : "result-mobile"
    return (<div className={className}>
        <p>Results</p>
        {(slot_data.length === 0) && "Waiting"}
        {(slot_data.length !== 0 && <ShowSlots {...slot_data} />)}
    </div>)
}

const ShowSlots = (slot_data: Array<SlotData>) => {
    return (<></>)
}

export default Result