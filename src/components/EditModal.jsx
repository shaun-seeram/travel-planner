import { remove, ref } from 'firebase/database';
import React, { useImperativeHandle, useRef } from 'react';
import {Form, useNavigate} from "react-router-dom"
import auth, { db } from '../firebase/authentication';
import { authActions } from '../store';
import { useDispatch } from 'react-redux';
import Modal from '../ui/Modal';
import Button, { save, trash } from '../ui/Button';

const EditModal = ({id, trip, ref: editRef}) => {

    const modalRef = useRef();
    const formRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        remove(ref(db, auth.currentUser.uid + "/trips/" + id))
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
                <label htmlFor='city' className='sr-only'>City</label>
                <input name='city' id='city' defaultValue={trip.city}></input>
                <label htmlFor='country' className='sr-only'>Country</label>
                <input name='country' id='country' defaultValue={trip.country}></input>
                <p>Changes to the dates will result in the reset of the itenerary module.</p>
                <label htmlFor='tripFrom' className='sr-only'>From</label>
                <input name='tripFrom' id='tripFrom' type='date' defaultValue={trip.from}></input>
                <label htmlFor='tripTo' className='sr-only'>To</label>
                <input name='tripTo' id='tripTo' type='date' defaultValue={trip.to}></input>
                <Button icon={save} type='submit' name='purpose' value="editTrip">Save</Button>
                <Button icon={trash} fn={handleDelete} red>Delete Trip</Button>
            </Form>
        </Modal>
    );
}

export default EditModal;