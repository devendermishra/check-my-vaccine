import { useState } from "react"
import LanguageIcon from '@material-ui/icons/Language'
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button'
import { getSelectedLanguage, selectLanguage, _T } from '../helpers/multilang'
import { CSSProperties } from "@material-ui/styles"
import { useDispatch } from "react-redux"
import { setLanguage } from "../helpers/actions"

interface LanguageSelectorProp {
}

export const LanguageSelector = (props: LanguageSelectorProp) => {

    return (<>
        <LanguageModal {...props} />
    </>)
}

//Add new language here.
const languageMap = [["हिंदी", "hi"], ["English", "en"]]

const LanguageModal = (props: LanguageSelectorProp) => {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
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
    return (
        <>
            <Button variant="contained" color="default"
                onClick={handleShow}
                startIcon={<LanguageIcon />} >{_T('CHANGE_LANG')}</Button>
            <Modal show={show} onHide={handleClose}>
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
            </Modal>
        </>
    )
}
