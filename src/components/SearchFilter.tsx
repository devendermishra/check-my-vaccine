import { makeStyles } from '@material-ui/core'
import {
    availableVaccines, ageGroups,
    weeks, doses, DISTRICT_MODE,
    PINCODE_MODE, vaccineTypes
} from '../helpers/constants'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import TextField from '@material-ui/core/TextField'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import FormControl from '@material-ui/core/FormControl'
import VisibilityIcon from '@material-ui/icons/Visibility'
import WarningIcon from '@material-ui/icons/Warning'
import CancelIcon from '@material-ui/icons/Cancel'
import ReplayIcon from '@material-ui/icons/Replay'
import { Dispatch, useEffect, useState } from 'react'
import Select from '@material-ui/core/Select'
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
        <p className="heading"><b>Search Filters</b></p>
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
                <Tab eventKey="dist" title="Search By District">
                    <SearchByState {...props} />
                    <CommonSearch {...props} />
                </Tab>
                <Tab eventKey="pin" title="Search By Pincode">
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
            <Selector label='State'
                values={states}
                callback={(value: number) => {
                    dispatch(selectState(value))
                    getDistrictFromLocalOrAPI(setDistricts, value)
                }} />&nbsp;&nbsp;
            &nbsp;&nbsp;
            <Selector label='District'
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
                    placeholder='Pincode' />
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
    const buttonText = state ? "Stop Monitoring" : "Monitor Slot"

    return (<>
        <br />
        <div style={{ alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Selector label="Vaccine Type"
                    callback={(vaccineId: number) => {
                        dispatch(selectVaccine(vaccineTypes[vaccineId]))
                    }}
                    values={availableVaccines} /><br />
                <Selector label="Dose"
                    callback={(dose) => {
                        dispatch(selectDose(dose))
                    }}
                    values={doses} /><br />
            </div>
        </div>
        <br />
        <div style={{ alignItems: 'start', alignContent: 'start', textAlign: 'left' }}>
            <Selector label="Age Group"
                callback={(ageId: number) => {
                    dispatch(selectAge(ageId))
                }}
                values={ageGroups} /><br />

            <Selector label="Week"
                callback={(week) => {
                    dispatch(selectWeek(week))
                }}
                values={weeks} />
            <br /> <br />
            &nbsp;&nbsp;<Button variant="contained" color="primary" startIcon={<VisibilityIcon />}
                onClick={() => {
                    dispatch(setSlot([]))
                    props.checkSlotsCB()
                }}>Check Slot</Button>
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
                }}>{buttonText}</Button>
            &nbsp;&nbsp;<Button variant="contained" color="default" startIcon={<ReplayIcon />}
                onClick={() => {
                    window.location.reload()
                }}>Reset</Button>
            &nbsp;&nbsp;
            <OverlayTrigger trigger="click" placement="right" overlay={Disclaimer}>
            <Button variant="contained" color="default" startIcon={<WarningIcon />}>
                Disclaimer</Button>
            </OverlayTrigger>
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

const Disclaimer = (
    <Popover id="disclaimer">
        <Popover.Title as="h3">Disclaimer</Popover.Title>
        <Popover.Content>
            Disclaimer:
            <ol>
                <li>This is a third-party application. It does not facilitate any appointment
                or booking of vaccine. Booking is to be done only by official medium
                like Cowin portal, Aarogya Setu or Umang App.
                </li>
                <li>Please check your state or local guidelines for vaccination.</li>
                <li>Please follow Covid-appropriate behaviour and keep yourself safe.</li>
                <li>Please always consult qualified doctor for any symptoms.
                    Do not self-medicate or follow other's prescription.
                    Do not delay testing and doctor consultation on any doubt.
                </li>
                <li>
                    There is no correctness guarantee of the data. This application
                    fetches data from the open API of Cowin. Responses may be
                    cached or delayed or withheld by these APIs.
                </li>
                <li>
                    Considering above point, it does not guarantee any availability of the slot.
                </li>
                <li>
                    We have no responsibility of any event arising due to the use of this website.
                </li>
                <li>
                    This website or app does not store any personal data. It does
                    not expect or store any cookie. It neither expect any personal
                    data in network communication.
                </li>
                <li>
                    Browser local storage is being used to provide smooth experience.
                    Only state and district data is stored. There is no personal data
                    stored. This can be viewed in local storage settings of the browser.
                </li>
                <li>
                    This website is open source. User is free to use and distribute.
                    Also, user can modify its code as per the requirement. But cannot claim
                    copyright over that.
                </li>
            </ol>
        </Popover.Content>
    </Popover>
);