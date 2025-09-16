import { Form, redirect } from "react-router-dom"
import { fbSet, latlonkey } from '../firebase/authentication';
import { tripActions, store } from '../store';
import classes from "./AddTrip.module.css"
import Button from '../ui/buttons/Button';
import { save } from '../ui/buttons/buttonIcons';
import { plannerMapping } from "../util";


const AddTrip = () => {

    console.log("Page: AddTrip")

    return (
        <Form method='post'>
            <span className={classes.formGroup}>
                <label htmlFor='city'>City</label>
                <input type='text' name="city" id='city' required></input>
            </span>
            <span className={classes.formGroup}>
                <label htmlFor='country'>Country</label>
                <input type='text' name="country" id='country' required></input>
            </span>
            <span className={classes.formGroup}>
                <label htmlFor='travelfrom'>From</label>
                <input type='date' name="travelfrom" id='travelfrom' required></input>
            </span>
            <span className={classes.formGroup}>
                <label htmlFor='travelto'>To</label>
                <input type='date' name="travelto" id='travelto' required></input>
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

    const plannerMap = plannerMapping(data.get("travelfrom"), data.get("travelto"))

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
        planner: plannerMap(),
        notes: ""
    })
    // IF SUCCESSFUL...

    store.dispatch(tripActions.addTrip({
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
            planner: plannerMap(),
            notes: ""
        }
    }))

    return redirect("/trips/" + tripId)
}
