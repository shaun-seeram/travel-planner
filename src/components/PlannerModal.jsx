import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form } from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';
import { fbDelete } from '../firebase/authentication';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';
import classes from "../ui/Modal.module.css"
import DeleteButton from '../ui/DeleteButton';

const PlannerModal = ({ id, ref }) => {

    console.log("PlannerModal")

    const [dateId, setDateId] = useState();
    const [plannerId, setPlannerId] = useState();
    const [defaultValues, setDefaultValues] = useState();
    const formRef = useRef();
    const modalRef = useRef();
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => {
        return {
            open(id) {
                setPlannerId(null)
                formRef.current.reset()
                setDateId(id)
                modalRef.current.open()
            },
            edit(dateId, plannerId, defaultValues) {
                formRef.current.reset()
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
                {plannerId && <input name="plannerId" className='sr-only' value={plannerId} readOnly></input>}
                <span className={classes.formGroup}>
                    <label htmlFor='place'>Place</label>
                    <input name='place' id='place' defaultValue={plannerId ? defaultValues.place : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='address'>Address</label>
                    <input name='address' id='address' defaultValue={plannerId ? defaultValues.address : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='notes'>Notes</label>
                    <textarea name='notes' id='notes' defaultValue={plannerId ? defaultValues.notes : ""}></textarea>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={save} type='submit' name='purpose' value={plannerId ? "editPlanner" : "addPlanner"}>Save</Button>
                    {plannerId && <DeleteButton fn={deletePlan} name='delete'>Delete</DeleteButton>}
                </span>
            </Form>
        </Modal>
    );
}

export default PlannerModal;