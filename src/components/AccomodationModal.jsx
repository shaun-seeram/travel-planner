import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';

const AccomodationModal = ({ref}) => {

    const formRef = useRef();
    const modalRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            open() {
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form ref={formRef} method='post' onSubmit={() => modalRef.current.close()}>
                <label htmlFor='name'>Name</label>
                <input name='name' id='name'></input>
                <label htmlFor='address'>Address</label>
                <textarea name='address' id='address' rows="4"></textarea>
                <Button icon={save} type='submit' name='purpose' value="addAccomodation">Save</Button>
            </Form>
        </Modal>
    );
}

export default AccomodationModal;