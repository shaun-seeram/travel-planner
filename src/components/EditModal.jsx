import { remove } from 'firebase/database';
import React, { useImperativeHandle, useRef } from 'react';
import {Form, useNavigate} from "react-router-dom"
import auth, { db } from '../firebase/authentication';
import { authActions } from '../store';
import { useDispatch } from 'react-redux';

const EditModal = ({id, trip, ref}) => {

    const modalRef = useRef();
    const formRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const closeForm = () => {
        modalRef.current.close()
        formRef.current.reset()
    }

    const handleDelete = () => {
        remove(ref(db, auth.currentUser.uid + "/trips/" + id))
        dispatch(authActions.removeTrip(id))
        return navigate("/trips/")
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
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <label htmlFor='city' className='sr-only'>City</label>
                <input name='city' id='city' defaultValue={trip.city}></input>
                <label htmlFor='country' className='sr-only'>Country</label>
                <input name='country' id='country' defaultValue={trip.country}></input>
                <label htmlFor='tripFrom' className='sr-only'>From</label>
                <input name='tripFrom' id='tripFrom' type='date' defaultValue={trip.from}></input>
                <label htmlFor='tripTo' className='sr-only'>To</label>
                <input name='tripTo' id='tripTo' type='date' defaultValue={trip.to}></input>
                <button type='submit' name='purpose' value="editTrip">Save</button>
            </Form>
            <button onClick={handleDelete}>Delete Trip</button>
            <button onClick={closeForm}>x</button>
        </dialog>
    );
}

export default EditModal;