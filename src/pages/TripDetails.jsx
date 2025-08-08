import { ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useParams, useActionData } from "react-router-dom"
import auth, { db, latlonkey } from '../firebase/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store';
import classes from "./TripDetails.module.css"
import Map from '../components/Map';
import TitleContainer from '../components/TitleContainer';
import GrayContainer from "../ui/GrayContainer"
import BudgetDetails from '../components/BudgetDetails';
import FlightDetails from '../components/FlightDetails';
import AccomodationDetails from "../components/AccomodationDetails"
import PlannerDetails from '../components/PlannerDetails';

const TripDetails = () => {

    const actionData = useActionData()
    const id = useParams().id
    const trip = useSelector(state => state.auth.trips[id])
    const dispatch = useDispatch()

    const [conversion, setConversion] = useState(0);

    useEffect(() => {
        const getConversion = async () => {
            const currency = trip.currency
            const res = await fetch(`https://api.fxratesapi.com/convert?from=CAD&to=${currency}&date=2012-06-24&amount=1&format=json`)
            const resJson = await res.json();
            setConversion(resJson.result.toFixed(2) || 0)
        }
        getConversion()
    }, [trip])

    useEffect(() => {
        if (actionData && actionData.purpose === "addAccomodation") {
            dispatch(authActions.addAccomodation({
                tripId: id,
                accomodationId: actionData.purposeId,
                accomodation: actionData.accomodation
            }))
        } else if (actionData && actionData.purpose === "addFlight") {
            dispatch(authActions.addFlight({
                tripId: id,
                flightId: actionData.purposeId,
                flight: actionData.flight
            }))
        } else if (actionData && actionData.purpose === "editBudget") {
            dispatch(authActions.editBudget({
                tripId: id,
                budget: actionData.budget
            }))
        } else if (actionData && actionData.purpose === "addExpense") {
            dispatch(authActions.addExpense({
                tripId: id,
                expenseId: actionData.purposeId,
                expense: actionData.expense
            }))
        } else if (actionData && actionData.purpose === "editTrip") {
            dispatch(authActions.editTrip({
                tripId: id,
                city: actionData.city,
                country: actionData.country,
                from: actionData.from,
                to: actionData.to,
                currency: actionData.currency,
                latitude: actionData.latitude,
                longitude: actionData.longitude
            }))
        }
    }, [actionData, dispatch, id])

    return (
        <>
            <Map key={trip.city + trip.country} trip={trip} />
            <TitleContainer id={id} trip={trip} />

            <div className={classes.split}>
                <div className={classes.half}>
                    
                    <BudgetDetails trip={trip} />
                    <FlightDetails trip={trip} />
                    <AccomodationDetails trip={trip} />
                    <GrayContainer>
                        <p>1 CAD = {conversion} {trip.currency}</p>
                    </GrayContainer>

                </div>
                <div className={`${classes.half} ${classes.halfRight}`}>
                    <h3>Planner</h3>
                    <PlannerDetails trip={trip} />
                </div>
            </div>

        </>
    );
}

export default TripDetails;

export const tripDetailsAction = async ({ request, params }) => {
    const data = await request.formData();
    const purpose = data.get("purpose")
    const purposeId = new Date().getTime()
    const id = params.id

    if (purpose === "addAccomodation") {
        const name = data.get("name")
        const address = data.get("address")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/accomodations/" + purposeId), {
            name,
            address
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            purposeId,
            accomodation: {
                name,
                address
            }
        }

    } else if (purpose === "addFlight") {
        const airline = data.get("airline")
        const fromAirport = data.get("fromAirport")
        const toAirport = data.get("toAirport")
        const flightNumber = data.get("flightNumber")
        const departureDate = data.get("departureDate")
        const boarding = data.get("boarding")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/flights/" + purposeId), {
            airline,
            fromAirport,
            toAirport,
            flightNumber,
            departureDate,
            boarding
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            purposeId,
            flight: {
                airline,
                fromAirport,
                toAirport,
                flightNumber,
                departureDate,
                boarding
            }
        }
    } else if (purpose === "editBudget") {
        const budget = data.get("budget")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/budget/"), {
            budget: +budget
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            budget: +budget
        }
    } else if (purpose === "addExpense") {
        const name = data.get("expenseName")
        const cost = data.get("expenseCost")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/budget/expenses/" + purposeId), {
            name,
            cost: +cost
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            purposeId,
            expense: {
                name,
                cost: +cost
            }
        }
    } else if (purpose === "editTrip") {
        const city = data.get("city")
        const country = data.get("country")
        const from = data.get("tripFrom")
        const to = data.get("tripTo")

        const latlonRes = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${data.get("city")}&country=${data.get("country")}`, {
            headers: {
                "X-Api-Key": latlonkey
            }
        })
    
        const latLon = await latlonRes.json()
    
        const currencyRes = await fetch(`https://api.api-ninjas.com/v1/country?name=${data.get("country")}`, {
            headers: {
                "X-Api-Key": latlonkey
            }
        })
    
        const currency = await currencyRes.json();

        await update(ref(db, auth.currentUser.uid + "/trips/" + id), {
            city,
            country,
            from,
            to,
            currency: currency[0].currency.code,
            latitude: latLon[0].latitude,
            longitude: latLon[0].longitude
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            city,
            country,
            from,
            to,
            currency: currency[0].currency.code,
            latitude: latLon[0].latitude,
            longitude: latLon[0].longitude
        }
    }

}