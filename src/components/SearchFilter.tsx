import PropTypes from 'prop-types';
import { AppBar, makeStyles } from '@material-ui/core'
import { availableVaccines, ageGroups, weeks, doses} from '../helpers/constants'
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
import { SelectElement } from '../helpers/types';


const SearchFilter = () => {
    return (<><SearchFilterDesktop /></>)
}

export default SearchFilter

const SearchFilterDesktop = () => {
    return (<div className="search-filter">
        <p className="heading"><b>Search Filters</b></p>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
                <Col style={{ width: "min-content" }}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="first">Search by District</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second">Search by Pincode</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <SearchByState />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <SearchByPin />
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
export const SearchFilterMobile = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
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
                <SearchByState />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SearchByPin />
            </TabPanel>
        </div>
    </div>)
}

const SearchByState = () => {
    return (<div className="search-condition">
        <StateSelector label='Select State'
            values={[{ id: 34, name: 'Uttar Pradesh' }]} callback={(value: number) => { }} /> <br />
        <StateSelector label='Select District' values={[]} callback={(value: number) => { }} /><br />
        <CommonSearch />
    </div>)
}

const SearchByPin = () => {
    return (
        <div className="search-condition">
            <TextField id="standard-basic" label="Enter Pincode"
                placeholder='Pincode' /><br/>
            <CommonSearch />
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
}
const CommonSearch = (props: CommonSearchProps) => {
    const {inProgress} = props
    console.log('DEVENDER inprogress ' + JSON.stringify(inProgress))
    const [state, setState] = useState(inProgress === undefined ? false : inProgress)
    const buttonColor = state ? "secondary" : "primary"
    const buttonIcon = state ? <CancelIcon /> : <PlayArrowIcon />
    const buttonText = state ? "Stop" : "Start"

    return (<><StateSelector label="Vaccine Type" callback={() => {}}
    values={availableVaccines} /><br />
        <StateSelector label="Age Group" callback={() => {}}
    values={ageGroups} /><br />
        <StateSelector label="Week" callback={() => {}}
    values={weeks} /><br />
        <StateSelector label="Dose" callback={() => {}}
    values={doses} /><br />
        <Button variant="contained" color={buttonColor} startIcon={buttonIcon}
            onClick={() => setState(!state)}>
            {buttonText}</Button>
    </>)
}
