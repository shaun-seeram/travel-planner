import React, { useImperativeHandle, useRef } from 'react';
import {Form, useNavigate} from "react-router-dom"
import { fbDelete } from '../firebase/authentication';
import { authActions } from '../store';
import { useDispatch } from 'react-redux';
import Modal from '../ui/Modal';
import Button, { save, trash } from '../ui/Button';
import classes from "../ui/Modal.module.css"

const EditModal = ({id, trip, ref: editRef}) => {

    const modalRef = useRef();
    const formRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        fbDelete("/trips/" + id)
        dispatch(authActions.removeTrip(id))
        return navigate("/trips/")
    }

    useImperativeHandle(editRef, () => {
        return {
            open() {
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <span className={classes.formGroup}>
                    <label htmlFor='city'>City</label>
                    <input name='city' id='city' defaultValue={trip.city}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='country'>Country</label>
                    <input name='country' id='country' defaultValue={trip.country}></input>
                </span>
                <p className={classes.warning}>Changes to the dates will result in the reset of the itenerary module.</p>
                <span className={classes.formGroup}>
                    <label htmlFor='tripFrom'>From</label>
                    <input name='tripFrom' id='tripFrom' type='date' defaultValue={trip.from}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='tripTo'>To</label>
                    <input name='tripTo' id='tripTo' type='date' defaultValue={trip.to}></input>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={save} type='submit' name='purpose' value="editTrip">Save</Button>
                    <Button icon={trash} fn={handleDelete} red>Delete Trip</Button>
                </span>
            </Form>
        </Modal>
    );
}

export default EditModal;