import WarningIcon from '@material-ui/icons/Warning'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { _T } from '../helpers/multilang'
import { Dropdown } from 'react-bootstrap'


export const TermsItem = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(true)
    }
    return (<><Dropdown.Item onSelect={handleShow}>{_T('TERMS')}
    </Dropdown.Item>
    <TermsBody show={show} setShow={setShow} />
    </>)
}

export const TermsModal = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    return (
        <>
            <Button variant="text" color="default"
                onClick={handleShow}
                startIcon={<WarningIcon />}>
                {_T('TERMS1')}</Button>
            <TermsBody show={show} setShow={setShow} />
        </>
    );
};

interface TermsBodyProps {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const TermsBody = (props: TermsBodyProps) => {

    const handleClose = () => props.setShow(false);
    return (
        <>

            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeLabel="" closeButton>
                    <Modal.Title>{_T('TERMS')}</Modal.Title>
                </Modal.Header>
                <Modal.Body><ol>
                    <li>{_T('TERMS1')}</li>
                    <li>{_T('DISC7')}</li>
                    <li>{_T('TERMS2')}</li>
                    <li>{_T('TERMS3')}</li>
                    <li>{_T('TERMS4')}</li>
                    <li>{_T('TERMS5')}</li>
                    <li>{_T('TERMS6')}</li>
                    <li>{_T('TERMS7')}</li>
                </ol></Modal.Body>
            </Modal>
        </>
    );
}