import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form } from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save, trash } from '../ui/Button';
import { fbDelete } from '../firebase/authentication';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';

const PlannerModal = ({ id, ref }) => {

    const [dateId, setDateId] = useState();
    const [plannerId, setPlannerId] = useState();
    const [defaultValues, setDefaultValues] = useState();
    const formRef = useRef();
    const modalRef = useRef();
    const dispatch = useDispatch();

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

    const deletePlan = () => {
        fbDelete("/trips/" + id + "/planner/" + dateId + "/plans/" + plannerId)
        dispatch(authActions.deletePlan({
            tripId: id,
            dateId,
            plannerId
        }))
    }

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name="plannerDate" className='sr-only' defaultValue={dateId}></input>
                {plannerId && <input name="plannerId" className='sr-only' value={plannerId}></input>}
                <label htmlFor='place'>Place</label>
                <input name='place' id='place' defaultValue={plannerId ? defaultValues.place : ""}></input>
                <label htmlFor='address'>Address</label>
                <input name='address' id='address' defaultValue={plannerId ? defaultValues.address : ""}></input>
                <label htmlFor='notes'>Notes</label>
                <textarea name='notes' id='notes' defaultValue={plannerId ? defaultValues.notes : ""}></textarea>
                <Button icon={save} type='submit' name='purpose' value={plannerId ? "editPlanner" : "addPlanner"}>Save</Button>
                {plannerId && <Button icon={trash} fn={deletePlan} name='delete' red>Delete</Button>}
            </Form>
        </Modal>
    );
}

export default PlannerModal;