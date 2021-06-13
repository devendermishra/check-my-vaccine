import WarningIcon from '@material-ui/icons/Warning'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { _T } from '../helpers/multilang'
import { Dropdown } from 'react-bootstrap'


export const DisclaimerItem = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(true)
    }
    return (<><Dropdown.Item onSelect={handleShow}><WarningIcon />&nbsp;{_T('DISCL')}
    </Dropdown.Item>
    <DisclaimerBody show={show} setShow={setShow} />
    </>)
}

export const DisclaimerModal = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<WarningIcon />}>
                {_T('DISCL')}</Button>
            <DisclaimerBody show={show} setShow={setShow} />
        </>
    );
};

interface DisclaimerBodyProps {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const DisclaimerBody = (props: DisclaimerBodyProps) => {

    const handleClose = () => props.setShow(false);
    return (
        <>

            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeLabel="" closeButton>
                    <Modal.Title>{_T('DISCL')}</Modal.Title>
                </Modal.Header>
                <Modal.Body><ol>
                    <li>{_T('DISC1')}</li>
                    <li>{_T('DISC5')}</li>
                    <li>{_T('DISC6')}</li>
                    <li>{_T('DISC7')}</li>
                    <li>{_T('DISC8')}</li>
                    <li>{_T('DISC9')}</li>
                    <li>{_T('DISC10')}</li>
                </ol></Modal.Body>
            </Modal>
        </>
    );
}