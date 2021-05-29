import PropTypes from 'prop-types';
import { AppBar, makeStyles } from '@material-ui/core'
import {
    availableVaccines, ageGroups,
    weeks, doses, DISTRICT_MODE,
    PINCODE_MODE, vaccineTypes
} from '../helpers/constants'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import TextField from '@material-ui/core/TextField'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import CancelIcon from '@material-ui/icons/Cancel'
import { useState } from 'react'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import './SearchFilter.css'
import { SelectElement, SlotData } from '../helpers/types';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAge, selectDistrict, selectDose,
    selectPincode, selectState, selectVaccine,
    selectWeek, setMode
} from '../helpers/actions';
import { startMonitoring } from '../helpers/timer'

interface SearchProps {
    setSlotData: React.Dispatch<React.SetStateAction<SlotData[]>>
    setAppState: React.Dispatch<React.SetStateAction<string>>
}

const SearchFilter = (props: SearchProps) => {
    return (<><SearchFilterDesktop {...props} /></>)
}

export default SearchFilter

const SearchFilterDesktop = (props: SearchProps) => {
    const dispatch = useDispatch()

    return (<div className="search-filter">
        <p className="heading"><b>Search Filters</b></p>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
                <Col style={{ width: "min-content" }}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="first"
                                onSelect={(eventKey) => dispatch(setMode(DISTRICT_MODE))}>Search by District</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second"
                                onSelect={(eventKey) => dispatch(setMode(PINCODE_MODE))}>Search by Pincode</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <SearchByState {...props} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <SearchByPin {...props} />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    </div>)
}

function a11yProps(index: number) {
    return {
        id: `wrapped-tab-${index}`,
        'aria-controls': `wrapped-tabpanel-${index}`,
    };
}
interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
                <>
                    <>{children}</>
                </>)}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

//Export to ignore warning
export const SearchFilterMobile = (props: SearchProps) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const dispatch = useDispatch()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
        dispatch(setMode(newValue === 0 ? DISTRICT_MODE : PINCODE_MODE))
    };

    return (<div className="search-filter">
        <p className="heading"><b>Search Filters</b></p>
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs variant="pills" value={value} onChange={handleChange}>
                    <Tab title="Search by District" label="Search by District" {...a11yProps(0)} />
                    <Tab title="Search by Pincode" label="Search by Pincode" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <SearchByState {...props} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SearchByPin {...props} />
            </TabPanel>
        </div>
    </div>)
}

const SearchByState = (props: CommonSearchProps) => {
    const dispatch = useDispatch()
    return (<div className="search-condition">
        <StateSelector label='Select State'
            values={[{ id: 34, name: 'Uttar Pradesh' }]}
            callback={(value: number) => { dispatch(selectState(value)) }} /> <br />
        <StateSelector label='Select District'
            values={[]}
            callback={(value: number) => { dispatch(selectDistrict(value)) }} /><br />
        <CommonSearch {...props} />
    </div>)
}

const SearchByPin = (props: CommonSearchProps) => {
    const dispatch = useDispatch()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(selectPincode(parseInt(event.target.value)))
    }
    return (
        <div className="search-condition">
            <TextField id="standard-basic" label="Enter Pincode"
                onChange={handleChange}
                placeholder='Pincode' /><br />
            <CommonSearch {...props} />
        </div>)
}

interface StateSelectorProps {
    children?: React.ReactNode;
    label: any;
    values: Array<SelectElement>;
    callback: (value: number) => void;
}

const StateSelector = (props: StateSelectorProps) => {
    const { label, values, callback } = props;
    const [state, setState] = useState('')
    const data = values || [];
    return (
        <>
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
                }
                }
            >
                {data.map(value => {
                    return (<MenuItem value={value.id}
                        key={value.name + value.id}>{value.name}</MenuItem>)
                })}
            </Select>
        </>
    )
}

interface CommonSearchProps {
    inProgress?: boolean
    setSlotData: React.Dispatch<React.SetStateAction<SlotData[]>>
    setAppState: React.Dispatch<React.SetStateAction<string>>
}

const CommonSearch = (props: CommonSearchProps) => {
    const { inProgress } = props
    const applicationState = useSelector(state => state)
    const dispatch = useDispatch()
    const [state, setState] = useState(inProgress === undefined ? false : inProgress)
    const buttonColor = state ? "secondary" : "primary"
    const buttonIcon = state ? <CancelIcon /> : <PlayArrowIcon />
    const buttonText = state ? "Stop" : "Start"

    return (<><StateSelector label="Vaccine Type"
        callback={(vaccineId: number) => {
            dispatch(selectVaccine(vaccineTypes[vaccineId]))
        }}
        values={availableVaccines} /><br />

        <StateSelector label="Age Group"
            callback={(ageId: number) => {
                dispatch(selectAge(ageId))
            }}
            values={ageGroups} /><br />

        <StateSelector label="Week"
            callback={(week) => {
                dispatch(selectWeek(week))
            }}
            values={weeks} /><br />

        <StateSelector label="Dose"
            callback={(dose) => {
                dispatch(selectDose(dose))
            }}
            values={doses} /><br />
        <Button variant="contained" color={buttonColor} startIcon={buttonIcon}
            onClick={() => {
                setState(!state)
                startMonitoring(applicationState, 15, props.setSlotData, props.setAppState)
            }}>
            {buttonText}</Button>
    </>)
}
