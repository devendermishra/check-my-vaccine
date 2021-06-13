import FavoriteIcon from '@material-ui/icons/Favorite'
import { useState } from "react"
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { _T } from '../helpers/multilang'
import { useDispatch, useSelector } from "react-redux"
import { remFavSlot } from "../helpers/actions"
import { ApplicationState, FavoriteSite } from '../helpers/types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteIcon from '@material-ui/icons/Delete'
import Table from 'react-bootstrap/esm/Table'
import { Dropdown } from 'react-bootstrap'

export const Favorite = () => {

    return (<><FavoriteModal /></>)
}

export const FavoriteItem = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(true)
    }
    return (<><Dropdown.Item onSelect={handleShow}>{_T('FAVORITE_SITES')}
    </Dropdown.Item>
    <FavoriteModalBody show={show} setShow={setShow} />
    </>)
}

const FavoriteModal = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<FavoriteIcon />} >{_T('FAVORITE_SITES')}</Button>
            <FavoriteModalBody show={show} setShow={setShow} />
        </>
    )
}

interface FavoriteModalBodyProps {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const FavoriteModalBody = (props: FavoriteModalBodyProps) => {
    const handleClose = () => props.setShow(false)
    const applicationState: ApplicationState = useSelector(x => x)

    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeLabel="" closeButton>
                    <Modal.Title>{_T('FAVORITE_SITES')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '400px', overflowY: 'scroll' }}>
                        {(!applicationState.favoriteSite || applicationState.favoriteSite.length < 1) &&
                            <p>{_T('NO_FAV_SLOTS')}</p>}
                        {applicationState.favoriteSite && applicationState.favoriteSite.length > 0 &&
                            <Table striped hover size="sm">
                                <thead key={'fav-result-thead'}>
                                    <tr>
                                        <th>{_T('SITE')}</th>
                                        <th>{_T('ADDR')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody key={'favsites-tbody-data'}>
                                    {applicationState.favoriteSite.map(site =>
                                    (<tr key={'fav-slots-' + site.centerId}>
                                        <td>{site.siteName}</td>
                                        <td>{site.siteAddress.split('\n').map(text => (<>{text}<br /></>))}</td>
                                        <td><RemoveFromFavorite site={site} /></td>
                                    </tr>))}
                                </tbody>
                            </Table>}
                    </div>
                    <Modal.Footer>
                        <Button variant="contained" color="secondary"
                            onClick={handleClose}>
                            {_T('CLOSE')}
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </>
    )
}


interface RemoveFromFavoriteProps {
    site: FavoriteSite
}

const RemoveFromFavorite = (props: RemoveFromFavoriteProps) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleYes = () => {
        dispatch(remFavSlot(props.site))
        setOpen(false);
    }

    return (
        <div>
            <Button variant="text" onClick={handleClickOpen} children={<DeleteIcon color="secondary" />} />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{_T("SURE_TITLE")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {_T("SURE_DELETE_FAVORITE")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleYes} color="secondary">
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
