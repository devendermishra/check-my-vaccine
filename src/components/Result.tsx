import { ReactElement } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Result.css'
import { isMobile } from "react-device-detect"
import { SlotData } from '../helpers/types'
import { DONE_STATE, WAITING_STATE } from '../helpers/constants';
import { DataGrid, GridColDef } from '@material-ui/data-grid';

interface ResultProps {
    slotData: SlotData[]
    appState: string
}

const Result = (props: ResultProps): ReactElement => {
    const className = !isMobile ? "result" : "result-mobile"
    const { slotData, appState } = props
    return (<div className={className}>
        {!appState && 'Click Start to start'}
        {(appState === WAITING_STATE && "Waiting")}
        {(slotData.length !== 0 && appState === DONE_STATE && <ShowSlots {...slotData} />)}
    </div>)
}

const ShowSlots = (slotData: Array<SlotData>) => {
    const columns: GridColDef[] = [
        { field: 'siteName', headerName: 'Site' },
        { field: 'siteAddress', headerName: 'Address' },
        { field: 'date', headerName: 'Date', type: 'number' },
        { field: 'age', headerName: 'Age' },
        { field: 'vaccine', headerName: 'Vaccine' },
        { field: 'slotsAvailable', headerName: 'Slots Available', type: 'number' },
        { field: 'firstDose', headerName: 'First Dose', type: 'number' },
        { field: 'secondDose', headerName: 'Second Dose', type: 'number' },
        { field: 'feeType', headerName: 'Fee Type' },
        { field: 'vaccineFee', headerName: 'Vaccine Fee' }
    ]

    return (<><DataGrid rows={slotData} columns={columns} pageSize={10} /></>)
}

export default Result
