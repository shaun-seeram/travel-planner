import { ref, set } from 'firebase/database';
import React from 'react';
import { Form, useActionData, useNavigate } from "react-router-dom"
import auth, { db } from '../firebase/authentication';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';

const AddTrip = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const tripData = useActionData();

    if (tripData) {
        dispatch(authActions.addTrip(tripData))
        navigate("/trips/" + tripData.id)
    }

    return (
        <Form method='post'>
            <label htmlFor='city'>City</label>
            <input type='text' name="city" id='city'></input>
            <label htmlFor='country'>Country</label>
            <input type='text' name="country" id='country'></input>
            <label htmlFor='travelto'>To</label>
            <input type='date' name="travelto" id='travelto'></input>
            <label htmlFor='travelfrom'>From</label>
            <input type='date' name="travelfrom" id='travelfrom'></input>
            <input type='submit'></input>
        </Form>
    );
}

export default AddTrip;

export const addTripAction = async ({request}) => {
    const data = await request.formData()
    const id = new Date().getTime()
    set(ref(db, auth.currentUser.uid + "/trips/" + id), {
        city: data.get("city"),
        country: data.get("country"),
        to: data.get("travelto"),
        from: data.get("travelfrom"),
    })
    // IF SUCCESSFUL...
    return {
        id,
        trip: {
            city: data.get("city"),
            country: data.get("country"),
            to: data.get("travelto"),
            from: data.get("travelfrom"),
        }
    }
}
