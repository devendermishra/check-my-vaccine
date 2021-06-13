import SettingsIcon from '@material-ui/icons/Settings';
import { ChangeEvent, SetStateAction, useState } from "react"
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { _T } from '../helpers/multilang'
import { useDispatch, useSelector } from "react-redux"
import { setPingInterval, setThreshold } from "../helpers/actions"
import { ApplicationState } from '../helpers/types'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Dispatch } from 'redux'
import { isMobile } from 'react-device-detect'
import { Dropdown } from 'react-bootstrap';


export const Settings = () => {

    return (<><SettingsModal /></>)
}

export const SettingsItem = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(true)
    }
    return (<><Dropdown.Item onSelect={handleShow}>{_T('SETTINGS')}
    </Dropdown.Item>
    <SettingsModalBody show={show} setShow={setShow} />
    </>)
}

const SettingsModal = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)

    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<SettingsIcon />} >{_T('SETTINGS')}</Button>
            <SettingsModalBody show={show} setShow={setShow} />
        </>
    )
}

interface SettingsModalBodyProps {
    show: boolean
    setShow: React.Dispatch<SetStateAction<boolean>>
}

const SettingsModalBody = (props: SettingsModalBodyProps) => {
    const handleClose = () => props.setShow(false)
    const dispatch = useDispatch()

    return (<Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeLabel="" closeButton>
            <Modal.Title>{_T('SETTINGS')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ThresholdInput />
            <IntervalSlider />
            <Modal.Footer>
                <LocalStorageClearDialog />
                {!isMobile && (<>&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;</>) }
                <Button variant="contained" color="default"
                    onClick={() => {
                        setDefaultSettings(dispatch)
                        handleClose()
                    }
                    }>
                    {_T('DEFAULT')}
                </Button>
                {!isMobile && (<>&nbsp;&nbsp;&nbsp;&nbsp;</>)}
            <Button variant="contained" color="secondary"
                    onClick={handleClose}>
                    {_T('CLOSE')}
                </Button>
            </Modal.Footer>
        </Modal.Body>
    </Modal>)
}

const setDefaultSettings = (dispatch: Dispatch<any>) => {
    localStorage.removeItem('min_threshold')
    localStorage.removeItem('preferred_interval')
    dispatch(setThreshold(1))
    dispatch(setPingInterval(5))
}

const ThresholdInput = () => {
    const applicationState: ApplicationState = useSelector(a => a)
    const [threshold, setThresholdValue] = useState(!applicationState.threshold ? '1' :
        '' + applicationState.threshold)
    const dispatch = useDispatch()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let thresholdValue = parseInt(event.target.value.trim())
        if (thresholdValue >= 1) {
            dispatch(setThreshold(parseInt(event.target.value.trim())))
            localStorage.setItem('min_threshold', '' + thresholdValue)
        }
        setThresholdValue(event.target.value.trim())
    }

    return (<>
        <b>{_T('MATCHING_THRESHOLD')}:</b> &nbsp;&nbsp;
        <TextField id="standard-basic"
            required
            onChange={handleChange}
            value={threshold}
            placeholder={_T('THRESHOLD')} />
        <br/>{_T('THRESHOLD_MESSAGE')}<br/><br/>
    </>)
}
const LocalStorageClearDialog = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleYes = () => {
        localStorage.clear()
        setOpen(false);
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                {_T('CLEAR_STORAGE')}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{_T("SURE_TITLE")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {_T("SURE_DELETE_CACHE")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleYes} color="primary">
                        {_T("YES")}
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        {_T("NO")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            
        },
        margin: {
            height: theme.spacing(3),
        },
    }),
);

const marks = [
    {
        value: 5,
        label: '5s',
    },
    {
        value: 10,
        label: '10s',
    },
    {
        value: 15,
        label: '15s',
    },
    {
        value: 20,
        label: '20s',
    },
    {
        value: 25,
        label: '25s',
    },
    {
        value: 30,
        label: '35s',
    }
];

const valuetext = (value: number) => {
    return `${value} sec`;
}

const IntervalSlider = () => {
    const classes = useStyles();
    const applicationState: ApplicationState = useSelector(a => a)
    const dispatch = useDispatch()
    const onChangeCommitted = (event: ChangeEvent<{}>, value: number | number[]) => {
        let intervalValue: number | null = null
        if (typeof value === 'number') {
            intervalValue = value as number
        } else {
            if ((value as number[]).length) {
                intervalValue = (value as number[])[0]
            }
        }
        if (intervalValue) {
            if (intervalValue >= 5 && intervalValue <= 30) {
                dispatch(setPingInterval(intervalValue))
                localStorage.setItem('preferred_interval', '' + intervalValue)
            }
        }
    }
    return (
        <div className={classes.root}>
            <Typography id="discrete-slider-custom" gutterBottom>
                <b>{_T('INTERVAL')}</b>
            </Typography>
            <Slider
                defaultValue={applicationState.interval!}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-custom"
                step={5}
                valueLabelDisplay="auto"
                marks={marks}
                min={5}
                max={30}
                onChangeCommitted={onChangeCommitted}
            />
            {_T('INTERVAL_MESSAGE')}&nbsp;&nbsp;
            {_T('JITTER')}
        </div>
    );
}