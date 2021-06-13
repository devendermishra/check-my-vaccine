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
import CancelIcon from '@material-ui/icons/Cancel'
import ReplayIcon from '@material-ui/icons/Replay'
import React, { Dispatch, useEffect, useState } from 'react'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText';
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
    selectWeek, setMode, setSearchResult
} from '../helpers/actions'
import { Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/core'
import { getDistricts, getStates } from '../helpers/api'
import { _T } from '../helpers/multilang'
import { playSound } from '../helpers/alerts'
import { LanguageSelector } from './LanguageSelector'
import PreferenceMenuDropDown from './PreferenceMenuDropDown'
import { TermsModal } from './TermsConditions'

interface SearchProps {
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
    checkSlotsCB: () => void
    checkFavSlotCB: () => void
    monitorSlotsCB: (completionCallback: () => void) => void
    monitorFavSlotsCB: (completionCallback: () => void) => void
    stopMonitorCB: () => void
}

const SearchFilter = (props: SearchProps) => {
    return (<><SearchFilterDesktop {...props} /></>)
}

export default SearchFilter

const SearchFilterDesktop = (props: SearchProps) => {
    return (<div className="search-filter">
        <p className="heading"><b>{_T('FILTERS')}</b>&nbsp;&nbsp;
        <LanguageSelector /><PreferenceMenuDropDown />
        </p>
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
                </Tab>
                <Tab eventKey="pin" title={_T('BY_PINCODE')}>
                    <SearchByPin {...props} />
                </Tab>
            </Tabs>
            <CommonSearch {...props} />
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
                required={true}
                callback={(value: number) => {
                    dispatch(selectState(value))
                    getDistrictFromLocalOrAPI(setDistricts, value)
                }} />&nbsp;&nbsp;
            &nbsp;&nbsp;
            <Selector label={_T('DISTRICT')}
                values={districts}
                required={true}
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
                &nbsp;&nbsp;<TextField id="standard-basic" label={_T('ENTER_PIN')}
                    onChange={handleChange}
                    required
                    style={{ margin: 0, padding: 0 }}
                    placeholder={_T('PINCODE')} />
                <FormHelperText>{_T('REQD')}</FormHelperText>
            </div>
        </div>)
}

interface SelectorProps {
    children?: React.ReactNode
    label: any
    values: Array<SelectElement>
    callback: (value: number) => void
    required?: boolean
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
            <FormControl required={props.required ? props.required : false}
                className={classes.formControl}>
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
                        return (<MenuItem value={value.id} id={label + "-item-" + value.id}
                            key={label + "-key-" + value.id}
                        >{_T(value.name)}</MenuItem>)
                    })}
                </Select>
                {props.required && <FormHelperText>{_T('REQD')}</FormHelperText>}
            </FormControl>
        </div>
    )
}

interface CommonSearchProps {
    inProgress?: boolean
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
    checkSlotsCB: () => void
    monitorSlotsCB: (completionCallback: () => void) => void
    checkFavSlotCB: () => void
    monitorFavSlotsCB: (completionCallback: () => void) => void
    stopMonitorCB: () => void
}

const CommonSearch = (props: CommonSearchProps) => {
    const dispatch = useDispatch()
    const [state, setState] = useState(false)
    const buttonColor = state ? "secondary" : "primary"
    const buttonIcon = state ? <CancelIcon /> : <PlayArrowIcon />
    const buttonText = state ? _T('STOP') : _T('MONITOR')
    const buttonTextFav = state ? _T('STOP') : _T('MONITOR_FAVORITE_SLOTS')
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
                values={weeks} /> &nbsp;&nbsp;{_T('WEEK_MEANS')}
            <br />
                &nbsp;&nbsp;<TermsModal />
            <br />
            <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                &nbsp;&nbsp;<Button variant="contained" color="primary" startIcon={<VisibilityIcon />}
                    onClick={() => {
                        dispatch(setSearchResult({ slots: [], unavailableSites: [] }))
                        props.checkSlotsCB()
                    }}><b>{_T('CHECK_SLOT')}</b></Button>
            &nbsp;&nbsp;<Button variant="contained" color={buttonColor} startIcon={buttonIcon}
                    onClick={() => {
                        const monitorState = state
                        setState(!state)
                        dispatch(setSearchResult({ slots: [], unavailableSites: [] }))
                        if (!monitorState) {
                            props.monitorSlotsCB(() => {
                                playSound(() => alert(_T('DONE')))
                                setState(false)

                            })
                        } else {
                            props.stopMonitorCB()
                        }
                    }}><b>{buttonText}</b></Button>
            </div>
            <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                &nbsp;&nbsp;<Button variant="contained" color="primary" startIcon={<VisibilityIcon />}
                    onClick={() => {
                        dispatch(setSearchResult({ slots: [], unavailableSites: [] }))
                        props.checkFavSlotCB()
                    }}><b>{_T('CHECK_FAV_SLOT')}</b></Button>
                &nbsp;&nbsp;<Button variant="contained" color={buttonColor} startIcon={buttonIcon}
                    onClick={() => {
                        const monitorState = state
                        setState(!state)
                        dispatch(setSearchResult({ slots: [], unavailableSites: [] }))
                        if (!monitorState) {
                            props.monitorFavSlotsCB(() => {
                                playSound(() => alert(_T('DONE')))
                                setState(false)

                            })
                        } else {
                            props.stopMonitorCB()
                        }
                    }}><b>{buttonTextFav}</b></Button>
            </div>
            <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                &nbsp;&nbsp;<Button variant="contained" color="default" startIcon={<ReplayIcon />}
                    onClick={() => {
                        window.location.reload()
                    }}>{_T('RESET')}</Button>
            </div>
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
