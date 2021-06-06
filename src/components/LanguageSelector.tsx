import { Dispatch, SetStateAction, useState } from "react"
import LanguageIcon from '@material-ui/icons/Language'
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { getSelectedLanguage, selectLanguage, _T } from '../helpers/multilang'
import { CSSProperties } from "@material-ui/styles"
import { useDispatch } from "react-redux"
import { setLanguage } from "../helpers/actions"
import MenuItem from '@material-ui/core/MenuItem'


interface LanguageSelectorProp {
    menuCallback? : () => void
}

export const LanguageSelector = (props: LanguageSelectorProp) => {

    return (<>
        <LanguageModal {...props} />
    </>)
}

export const LanguageMenu = (props: LanguageSelectorProp) => {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        if (props.menuCallback) {
            props.menuCallback()
        }
        setShow(true)
    }

    return (
        <>
            <MenuItem onClick={handleShow}><LanguageIcon color='primary'/>&nbsp;&nbsp;{_T('CHANGE_LANG')}</MenuItem>
            <LanguageModalBody show={show} setShow={setShow} />
        </>
    )
}
//Add new language here.
const languageMap = [["हिंदी", "hi"], ["English", "en"]]

const LanguageModal = (props: LanguageSelectorProp) => {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)

    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<LanguageIcon />} >{_T('CHANGE_LANG')}</Button>
            <LanguageModalBody show={show} setShow={setShow} />
        </>
    )
}

interface LanguageModalProps {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

const LanguageModalBody = (props: LanguageModalProps) => {
    const handleClose = () => props.setShow(false)
    const dispatch = useDispatch()
    const buttonStyle: CSSProperties = {
        backgroundColor: "#3f51b5",
        borderRadius: "10px",
        fontWeight: "bold",
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        margin: "5px",
        paddingLeft: "5px",
        fontSize: "15pt",
        width: "50%",
        color: "whitesmoke"
    }
    const selectedLanguageStyle: CSSProperties = {
        backgroundColor: "#3f51ff",
        borderRadius: "10px",
        fontWeight: "bold",
        borderColor: "red",
        borderWidth: "5px",
        borderStyle: "solid",
        margin: "5px",
        paddingLeft: "5px",
        fontSize: "15pt",
        width: "50%",
        color: "whitesmoke"
    }
    const changeLanguage = (langCode: string) => () => {
        selectLanguage(langCode)
        localStorage.setItem('preferred_lang', langCode)
        dispatch(setLanguage(langCode))
        handleClose()
    }
    const currentLangage = getSelectedLanguage()
    return (<Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeLabel="" closeButton>
            <Modal.Title>{_T('CHANGE_LANG')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                {languageMap.map((langElem) => {
                    return (<div
                        key={"lang-modal-" + langElem[1]}
                        style={langElem[1] === currentLangage ? selectedLanguageStyle : buttonStyle}
                        onClick={changeLanguage(langElem[1])}>
                        {langElem[0]}
                    </div>)
                })}
            </div>
        </Modal.Body>
    </Modal>)
}