import SettingsIcon from '@material-ui/icons/Settings';
import { ChangeEvent, useState } from "react"
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { _T } from '../helpers/multilang'
import { useDispatch, useSelector } from "react-redux"
import {  setPingInterval } from "../helpers/actions"
import { ApplicationState } from '../helpers/types'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'


export const Settings = () => {

    return (<><SettingsModal /></>)
}

const SettingsModal = () => {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    
    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<SettingsIcon />} >{_T('SETTINGS')}</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeLabel="" closeButton>
                    <Modal.Title>{_T('SETTINGS')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <IntervalSlider />
                </Modal.Body>
            </Modal>
        </>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 300,
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
  const applicationState: ApplicationState = useSelector(a=>a)
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
        {_T('INTERVAL')}
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
      {_T('JITTER')}
    </div>
  );
}