import React, { useEffect } from 'react';
import { Form, useActionData, useNavigate, redirect } from "react-router-dom"
import { fbSet, latlonkey } from '../firebase/authentication';
import { useDispatch } from 'react-redux';
import { authActions, store } from '../store';
import classes from "./AddTrip.module.css"
import Button, { save } from '../ui/Button';

const AddTrip = () => {

    console.log("Page: AddTrip")

    return (
        <Form method='post'>
            <span className={classes.formGroup}>
                <label htmlFor='city'>City</label>
                <input type='text' name="city" id='city'></input>
            </span>
            <span className={classes.formGroup}>
                <label htmlFor='country'>Country</label>
                <input type='text' name="country" id='country'></input>
            </span>
            <span className={classes.formGroup}>
                <label htmlFor='travelfrom'>From</label>
                <input type='date' name="travelfrom" id='travelfrom'></input>
            </span>
            <span className={classes.formGroup}>
                <label htmlFor='travelto'>To</label>
                <input type='date' name="travelto" id='travelto'></input>
            </span>
            <span className={classes.buttonsContainer}>
                <Button icon={save} type="submit">Add Trip</Button>
            </span>
        </Form>
    );
}

export default AddTrip;

export const addTripAction = async ({request}) => {
    const data = await request.formData()
    const tripId = new Date().getTime()
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

    const plannerMap = () => {
        const from = new Date(data.get("travelfrom").split("-"))
        const to = new Date (data.get("travelto").split("-"))
        const planner = {}
        const months = ["January", "February", "March", "April", "May", "June", 'July', "August", 'September', "October", "November", 'December']
    
        for (let i = from.getTime(); i <= (to.getTime()); i += 86400000) {
            const iteration = new Date(i)
            planner[i] = {
                stringifiedDate: `${months[iteration.getMonth()]} ${iteration.getDate()}, ${iteration.getFullYear()}`
            }
        }
        return planner
    }

    await fbSet("/trips/" + tripId, {
        city: data.get("city"),
        country: data.get("country"),
        to: data.get("travelto"),
        from: data.get("travelfrom"),
        latitude: resJson[0].latitude,
        longitude: resJson[0].longitude,
        currency: currencyResJson[0].currency.code,
        budget: {
            budget: 0
        },
        planner: plannerMap()
    })
    // IF SUCCESSFUL...

    store.dispatch(authActions.addTrip({
        tripId,
        trip: {
            city: data.get("city"),
            country: data.get("country"),
            to: data.get("travelto"),
            from: data.get("travelfrom"),
            latitude: resJson[0].latitude,
            longitude: resJson[0].longitude,
            currency: currencyResJson[0].currency.code,
            budget: {
                budget: 0
            },
            planner: plannerMap()
        }
    }))

    return redirect("/trips/" + tripId)
}
