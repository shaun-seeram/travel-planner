import { useImperativeHandle, useRef } from 'react';
import classes from "./Modal.module.css"
import {createPortal} from "react-dom"
import { close } from './buttons/buttonIcons';

const Modal = ({ref, children}) => {

    console.log("UI: Modal")

    const modalRef = useRef();

    const closeDialog = () => {
        modalRef.current.close()
    }

    useImperativeHandle(ref, () => {
        return {
            open() {
                modalRef.current.showModal()
            },
            close() {
                modalRef.current.close()
            }
        }
    })

    return (
        createPortal(<dialog className={classes.modal} ref={modalRef}>
            <button className={classes.closeButton} onClick={closeDialog}>{close}</button>
            {children}
        </dialog>, document.getElementById("modal"))
    );
}

export default Modal;