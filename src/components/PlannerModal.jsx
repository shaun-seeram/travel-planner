import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form } from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';

const PlannerModal = ({ ref }) => {

    const [dateId, setDateId] = useState();
    const [plannerId, setPlannerId] = useState();
    const [defaultValues, setDefaultValues] = useState();
    const formRef = useRef();
    const modalRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            open(id) {
                setDateId(id)
                modalRef.current.open()
            },
            edit(dateId, plannerId, defaultValues) {
                setDateId(dateId)
                setPlannerId(plannerId)
                setDefaultValues(defaultValues)
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name="plannerDate" className='sr-only' value={dateId}></input>
                {plannerId && <input name="plannerId" className='sr-only' value={plannerId}></input>}
                <label htmlFor='place'>Place</label>
                <input name='place' id='place' defaultValue={plannerId ? defaultValues.place : ""}></input>
                <label htmlFor='address'>Address</label>
                <input name='address' id='address' defaultValue={plannerId ? defaultValues.address : ""}></input>
                <label htmlFor='notes'>Notes</label>
                <textarea name='notes' id='notes' defaultValue={plannerId ? defaultValues.notes : ""}></textarea>
                <Button icon={save} type='submit' name='purpose' value={plannerId ? "editPlanner" : "addPlanner"}>Save</Button>
            </Form>
        </Modal>
    );
}

export default PlannerModal;