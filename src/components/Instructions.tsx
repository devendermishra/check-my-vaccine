import WarningIcon from '@material-ui/icons/Warning'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { _T } from '../helpers/multilang'
import { Dropdown } from 'react-bootstrap'
import DirectionsIcon from '@material-ui/icons/Directions'

export const InstructionsItem = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(true)
    }
    return (<><Dropdown.Item onSelect={handleShow}><DirectionsIcon />&nbsp;{_T('INSTR')}
    </Dropdown.Item>
        <InstructionsBody show={show} setShow={setShow} />
    </>)
}

export const InstructionsModal = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<WarningIcon />}>
                {_T('INSTR')}</Button>
            <InstructionsBody show={show} setShow={setShow} />
        </>
    );
};

interface InstructionsBodyProps {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const InstructionsBody = (props: InstructionsBodyProps) => {

    const handleClose = () => props.setShow(false);
    return (
        <>

            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeLabel="" closeButton>
                    <Modal.Title>{_T('INSTR')}</Modal.Title>
                </Modal.Header>
                <Modal.Body><ol>
                    <li>{_T('DISC2')}</li>
                    <li>{_T('DISC3')}</li>
                    <li>{_T('DISC4')}</li>
                    <li>{_T('INSTR1')}</li>
                    <li>{_T('INSTR2')}</li>
                </ol></Modal.Body>
            </Modal>
        </>
    );
}