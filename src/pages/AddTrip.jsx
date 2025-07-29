import { ref, set } from 'firebase/database';
import React, { useEffect } from 'react';
import { Form, useActionData, useNavigate } from "react-router-dom"
import auth, { db, latlonkey } from '../firebase/authentication';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';

const AddTrip = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const tripData = useActionData();

    useEffect(() => {
        if (tripData) {
            dispatch(authActions.addTrip(tripData))
            navigate("/trips/" + tripData.id)
        }
    }, [tripData, dispatch, navigate])

    return (
        <Form method='post'>
            <label htmlFor='city'>City</label>
            <input type='text' name="city" id='city'></input>
            <label htmlFor='country'>Country</label>
            <input type='text' name="country" id='country'></input>
            <label htmlFor='travelfrom'>From</label>
            <input type='date' name="travelfrom" id='travelfrom'></input>
            <label htmlFor='travelto'>To</label>
            <input type='date' name="travelto" id='travelto'></input>
            <input type='submit'></input>
        </Form>
    );
}

export default AddTrip;

export const addTripAction = async ({request}) => {
    const data = await request.formData()
    const id = new Date().getTime()
    const latlonRes = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${data.get("city")}&country=${data.get("country")}`, {
        headers: {
            "X-Api-Key": latlonkey
        }
    })
    const resJson = await latlonRes.json()

    const currencyRes = await fetch(`https://api.api-ninjas.com/v1/country?name=${data.get("country")}`, {
        headers: {
            "X-Api-Key": latlonkey
        }
    })
    const currencyResJson = await currencyRes.json();

    await set(ref(db, auth.currentUser.uid + "/trips/" + id), {
        city: data.get("city"),
        country: data.get("country"),
        to: data.get("travelto"),
        from: data.get("travelfrom"),
        latitude: resJson[0].latitude,
        longitude: resJson[0].longitude,
        currency: currencyResJson[0].currency.code,
        budget: {
            budget: 0
        }
    })
    // IF SUCCESSFUL...
    return {
        id,
        trip: {
            city: data.get("city"),
            country: data.get("country"),
            to: data.get("travelto"),
            from: data.get("travelfrom"),
            latitude: resJson[0].latitude,
            longitude: resJson[0].longitude,
            currency: currencyResJson[0].currency.code
        }
    }
}
