import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"

const AccomodationModal = ({ref}) => {

    const modalRef = useRef();
    const formRef = useRef();

    const closeForm = () => {
        modalRef.current.close()
        formRef.current.reset()
    }

    useImperativeHandle(ref, () => {
        return {
            open() {
                modalRef.current.showModal()
            }
        }
    })

    return (
        <dialog ref={modalRef}>
            <Form ref={formRef} method='post' onSubmit={() => modalRef.current.close()}>
                <label htmlFor='name'>Name</label>
                <input name='name' id='name'></input>
                <label htmlFor='address'>Address</label>
                <textarea name='address' id='address' rows="4"></textarea>
                <button type='submit' name='purpose' value="addAccomodation">Save</button>
            </Form>
            <button onClick={closeForm}>x</button>
        </dialog>
    );
}

export default AccomodationModal;
