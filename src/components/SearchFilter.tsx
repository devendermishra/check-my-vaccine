import { makeStyles } from '@material-ui/core'
import {
    availableVaccines, ageGroups,
    weeks, doses, DISTRICT_MODE,
    PINCODE_MODE, vaccineTypes
} from '../helpers/constants'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import TextField from '@material-ui/core/TextField'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import FormControl from '@material-ui/core/FormControl'
import VisibilityIcon from '@material-ui/icons/Visibility'
import WarningIcon from '@material-ui/icons/Warning'
import CancelIcon from '@material-ui/icons/Cancel'
import ReplayIcon from '@material-ui/icons/Replay'
import { Dispatch, useEffect, useState } from 'react'
import Select from '@material-ui/core/Select'
import Modal from 'react-bootstrap/Modal'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import './SearchFilter.css'
import { AppState, SelectElement } from '../helpers/types'
import { useDispatch } from 'react-redux'
import {
    selectAge, selectDistrict, selectDose,
    selectPincode, selectState, selectVaccine,
    selectWeek, setMode, setSlot
} from '../helpers/actions'
import { Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/core'
import { getDistricts, getStates } from '../helpers/api'
import { _T } from '../helpers/multilang'
import { LanguageSelector } from './LanguageSelector'


interface SearchProps {
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
    checkSlotsCB: () => void
    monitorSlotsCB: (completionCallback: () => void) => void
    stopMonitorCB: () => void
}

const SearchFilter = (props: SearchProps) => {
    return (<><SearchFilterDesktop {...props} /></>)
}

export default SearchFilter

const SearchFilterDesktop = (props: SearchProps) => {
    return (<div className="search-filter">
        <p className="heading"><b>{_T('FILTERS')}</b>&nbsp;&nbsp;<LanguageSelector/></p>
        <SimpleTabs {...props} />
    </div>)
}

export function SimpleTabs(props: SearchProps) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [key, setKey] = useState('dist');
    useEffect(() => {
        dispatch(setMode(key === 'dist' ? DISTRICT_MODE : PINCODE_MODE))
    }, [dispatch, key])

    return (
        <div className={classes.root}>
            <Tabs
                variant="pills"
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k: string | null) => {
                    if (k) {
                        dispatch(setMode(k === 'dist' ? DISTRICT_MODE : PINCODE_MODE))
                        setKey(k)
                    }
                }
                }
            >
                <Tab eventKey="dist" title={_T('BY_DISTRICT')}>
                    <SearchByState {...props} />
                    <CommonSearch {...props} />
                </Tab>
                <Tab eventKey="pin" title={_T('BY_PINCODE')}>
                    <SearchByPin {...props} />
                    <CommonSearch {...props} />
                </Tab>
            </Tabs>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const SearchByState = (props: CommonSearchProps) => {
    const dispatch = useDispatch()
    const [states, setStates] = useState([] as SelectElement[])
    const [districts, setDistricts] = useState([] as SelectElement[])
    useEffect(() => {
        if (states.length <= 0) {
            getStatesFromLocalOrAPI(setStates)
        }
    }, [states])

    return (
        <div style={{ display: 'flex', height: '64px' }}>
            <Selector label={_T('STATE')}
                values={states}
                callback={(value: number) => {
                    dispatch(selectState(value))
                    getDistrictFromLocalOrAPI(setDistricts, value)
                }} />&nbsp;&nbsp;
            &nbsp;&nbsp;
            <Selector label={_T('DISTRICT')}
                values={districts}
                callback={(value: number) => { dispatch(selectDistrict(value)) }} />
        </div>
    )
}

const SearchByPin = (props: CommonSearchProps) => {
    const dispatch = useDispatch()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(selectPincode(parseInt(event.target.value.trim())))
    }
    return (
        <div>
            <div style={{ textAlign: 'left', display: 'flex', height: '64px' }}>
                &nbsp;&nbsp;<TextField id="standard-basic" label="Enter Pincode"
                    onChange={handleChange}
                    style={{ margin: 0, padding: 0 }}
                    placeholder={_T('PINCODE')} />
            </div>
        </div>)
}

interface SelectorProps {
    children?: React.ReactNode;
    label: any;
    values: Array<SelectElement>;
    callback: (value: number) => void;
}

const useSelectStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

const Selector = (props: SelectorProps) => {
    const classes = useSelectStyles();
    const { label, values, callback } = props;
    const [state, setState] = useState('')
    const data = values || [];
    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id={"demo-simple-select-" + label}>{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={state}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        setState(event.target.value as string)
                        if (callback) {
                            callback(event.target.value as number)
                        }
                    }}
                >
                    {data.map(value => {
                        return (<MenuItem value={value.id}>{value.name}</MenuItem>)
                    })}
                </Select>
            </FormControl>
        </div>
    )
}

interface CommonSearchProps {
    inProgress?: boolean
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
    checkSlotsCB: () => void
    monitorSlotsCB: (completionCallback: () => void) => void
    stopMonitorCB: () => void
}

const CommonSearch = (props: CommonSearchProps) => {
    const dispatch = useDispatch()
    const [state, setState] = useState(false)
    const buttonColor = state ? "secondary" : "primary"
    const buttonIcon = state ? <CancelIcon /> : <PlayArrowIcon />
    const buttonText = state ? _T('STOP') : _T('MONITOR')

    return (<>
        <br />
        <div style={{ alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Selector label={_T('VACC_TYPE')}
                    callback={(vaccineId: number) => {
                        dispatch(selectVaccine(vaccineTypes[vaccineId]))
                    }}
                    values={availableVaccines} /><br />
                <Selector label={_T('DOSE')}
                    callback={(dose) => {
                        dispatch(selectDose(dose))
                    }}
                    values={doses} /><br />
            </div>
        </div>
        <br />
        <div style={{ alignItems: 'start', alignContent: 'start', textAlign: 'left' }}>
            <Selector label={_T('AGE_GRP')}
                callback={(ageId: number) => {
                    dispatch(selectAge(ageId))
                }}
                values={ageGroups} /><br />

            <Selector label={_T("WEEK")}
                callback={(week) => {
                    dispatch(selectWeek(week))
                }}
                values={weeks} />
            <br /> <br />
            &nbsp;&nbsp;<Button variant="contained" color="primary" startIcon={<VisibilityIcon />}
                onClick={() => {
                    dispatch(setSlot([]))
                    props.checkSlotsCB()
                }}><b>{_T('CHECK_SLOT')}</b></Button>
            &nbsp;&nbsp;<Button variant="contained" color={buttonColor} startIcon={buttonIcon}
                onClick={() => {
                    const monitorState = state
                    setState(!state)
                    dispatch(setSlot([]))
                    if (!monitorState) {
                        props.monitorSlotsCB(() => {
                            setState(false)
                        })
                    } else {
                        props.stopMonitorCB()
                    }
                }}><b>{buttonText}</b></Button>
            &nbsp;&nbsp;<Button variant="contained" color="default" startIcon={<ReplayIcon />}
                onClick={() => {
                    window.location.reload()
                }}>{_T('RESET')}</Button>
            &nbsp;&nbsp;
            <DisclaimerModal />&nbsp;&nbsp;
            <br /><br />
        </div>
    </>)
}

const getStatesFromLocalOrAPI = (setStates: Dispatch<React.SetStateAction<SelectElement[]>>) => {
    let stateList = []
    const key = 'stateList'
    const stateString = localStorage.getItem(key)
    if (stateString) {
        stateList = JSON.parse(stateString)
        setStates(stateList)
    } else {
        getStates().then(response => {
            let itemList: SelectElement[] = response.states
                .map(x => { return { id: x.state_id, name: x.state_name } })
            stateList = itemList
            localStorage.setItem(key, JSON.stringify(stateList))
            setStates(stateList)
        })
    }
}

const getDistrictFromLocalOrAPI = (setDistrict: Dispatch<React.SetStateAction<SelectElement[]>>,
    stateId: number) => {
    let stateList = []
    const key = 'districtList-' + stateId
    const stateString = localStorage.getItem(key)
    if (stateString) {
        stateList = JSON.parse(stateString)
        setDistrict(stateList)
    } else {
        getDistricts(stateId).then(response => {
            let itemList: SelectElement[] = response.districts
                .map(x => { return { id: x.district_id, name: x.district_name } })
            stateList = itemList
            localStorage.setItem(key, JSON.stringify(stateList))
            setDistrict(stateList)
        })
    }
}

const DisclaimerModal = () => {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<WarningIcon />}>
                {_T('DISCL')}</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeLabel="" closeButton>
                    <Modal.Title>{_T('DISCL')}</Modal.Title>
                </Modal.Header>
                <Modal.Body><ol>
                    <li>{_T('DISC1')}</li>
                    <li>{_T('DISC2')}</li>
                    <li>{_T('DISC3')}</li>
                    <li>{_T('DISC4')}</li>
                    <li>{_T('DISC5')}</li>
                    <li>{_T('DISC6')}</li>
                    <li>{_T('DISC7')}</li>
                    <li>{_T('DISC8')}</li>
                    <li>{_T('DISC9')}</li>
                    <li>{_T('DISC10')}</li>
                </ol></Modal.Body>
            </Modal>
        </>
    )
}
