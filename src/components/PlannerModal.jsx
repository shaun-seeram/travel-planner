import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form } from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';

const PlannerModal = ({ ref }) => {

    const [plannerId, setPlannerId] = useState();
    const formRef = useRef();
    const modalRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            open(id) {
                setPlannerId(id)
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name="plannerDate" className='sr-only' value={plannerId}></input>
                <label htmlFor='place'>Place</label>
                <input name='place' id='place'></input>
                <label htmlFor='address'>Address</label>
                <input name='address' id='address'></input>
                <label htmlFor='notes'>Notes</label>
                <textarea name='notes' id='notes'></textarea>
                <Button icon={save} type='submit' name='purpose' value="addPlanner">Save</Button>
            </Form>
        </Modal>
    );
}

export default PlannerModal;