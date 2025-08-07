import React, { useImperativeHandle, useRef } from 'react';
import classes from "./Modal.module.css"

const Modal = ({ref, formRef, children}) => {

    const modalRef = useRef();

    const closeDialog = () => {
        modalRef.current.close()
        formRef.current.reset()
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
        <dialog className={classes.modal} ref={modalRef}>
            <button className={classes.closeButton} onClick={closeDialog}>x</button>
            {children}
        </dialog>
    );
}

export default Modal;