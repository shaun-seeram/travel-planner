import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useActionData, useLoaderData } from "react-router-dom"
import { fbUpdate, geocodingKey, latlonkey } from '../firebase/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, store } from '../store';
import classes from "./TripDetails.module.css"
import Map from '../components/Map';
import TitleContainer from '../components/TitleContainer';
import GrayContainer from "../ui/GrayContainer"
import BudgetDetails from '../components/BudgetDetails';
import FlightDetails from '../components/FlightDetails';
import AccomodationDetails from "../components/AccomodationDetails"
import PlannerDetails from '../components/PlannerDetails';

const TripDetails = () => {

    console.log("Page: TripDetails")

    const id = useSelector(state => state.auth.currentPage)

    // const [conversion, setConversion] = useState(0);

    // useEffect(() => {
    //     const getConversion = async () => {
    //         const currency = trip.currency
    //         const res = await fetch(`https://api.fxratesapi.com/convert?from=CAD&to=${currency}&date=2012-06-24&amount=1&format=json`)
    //         const resJson = await res.json();
    //         setConversion(resJson.result.toFixed(2) || 0)
    //     }
    //     getConversion()
    // }, [trip])

    return (
        <>
            <Map id={id} />
            <TitleContainer id={id} />

            <div className={classes.split}>
                <div className={classes.half}>

                    <BudgetDetails id={id} />
                    <FlightDetails id={id} />
                    <AccomodationDetails id={id} />
                    {/* <GrayContainer>
                        <p>1 CAD = {conversion} {trip.currency}</p>
                    </GrayContainer> */}

                </div>
                <div className={`${classes.half} ${classes.halfRight}`}>
                    <PlannerDetails id={id} />
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

        await fbUpdate("/trips/" + id + "/accomodations/" + purposeId, {
            name,
            address
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.addAccomodation({
            tripId: id,
            accomodationId: purposeId,
            accomodation: {
                name,
                address
            }
        }))
        return null

    } else if (purpose === "editAccomodation") {
        const accomodationId = data.get("accomodationId")
        const name = data.get("name")
        const address = data.get("address")

        await fbUpdate("/trips/" + id + "/accomodations/" + accomodationId, {
            name,
            address
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.addAccomodation({
            tripId: id,
            accomodationId,
            accomodation: {
                name,
                address
            }
        }))
        return null

    } else if (purpose === "addFlight") {
        const airline = data.get("airline")
        const fromAirport = data.get("fromAirport")
        const toAirport = data.get("toAirport")
        const flightNumber = data.get("flightNumber")
        const departureDate = data.get("departureDate")
        const boarding = data.get("boarding")

        await fbUpdate("/trips/" + id + "/flights/" + purposeId, {
            airline,
            fromAirport,
            toAirport,
            flightNumber,
            departureDate,
            boarding
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.addFlight({
            tripId: id,
            flightId: purposeId,
            flight: {
                airline,
                fromAirport,
                toAirport,
                flightNumber,
                departureDate,
                boarding
            }
        }))
        return null
    } else if (purpose === "editFlight") {
        const flightId = data.get("flightId")
        const airline = data.get("airline")
        const fromAirport = data.get("fromAirport")
        const toAirport = data.get("toAirport")
        const flightNumber = data.get("flightNumber")
        const departureDate = data.get("departureDate")
        const boarding = data.get("boarding")

        await fbUpdate("/trips/" + id + "/flights/" + flightId, {
            airline,
            fromAirport,
            toAirport,
            flightNumber,
            departureDate,
            boarding
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.addFlight({
            tripId: id,
            flightId,
            flight: {
                airline,
                fromAirport,
                toAirport,
                flightNumber,
                departureDate,
                boarding
            }
        }))
        return null
    } else if (purpose === "editBudget") {
        const budget = data.get("budget")

        await fbUpdate("/trips/" + id + "/budget/", {
            budget: +budget
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.editBudget({
            tripId: id,
            budget: +budget
        }))
        return null
    } else if (purpose === "addExpense") {
        const name = data.get("expenseName")
        const cost = data.get("expenseCost")

        await fbUpdate("/trips/" + id + "/budget/expenses/" + purposeId, {
            name,
            cost: +cost
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.addExpense({
            tripId: id,
            expenseId: purposeId,
            expense: {
                name,
                cost: +cost
            }
        }))

        return null
    } else if (purpose === "editExpense") {
        const name = data.get("expenseName")
        const cost = data.get("expenseCost")
        const expenseId = data.get("expenseId")

        await fbUpdate("/trips/" + id + "/budget/expenses/" + expenseId, {
            name,
            cost: +cost
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.addExpense({
            tripId: id,
            expenseId,
            expense: {
                name,
                cost: +cost
            }
        }))
        return null

    } 
    else if (purpose === "editTrip") {
        const city = data.get("city")
        const country = data.get("country")
        const from = data.get("tripFrom")
        const to = data.get("tripTo")
        const comparedStore = store.getState().auth.trips[id]
        const oldFrom = comparedStore.from;
        const oldTo = comparedStore.to;


        if (from !== oldFrom || to !== oldTo) {
            const newFrom = new Date(from.split("-"))
            const newTo = new Date(to.split("-"))
            const planner = {}
            const months = ["January", "February", "March", "April", "May", "June", 'July', "August", 'September', "October", "November", 'December']

            for (let i = newFrom.getTime(); i <= (newTo.getTime()); i += 86400000) {
                const iteration = new Date(i)
                planner[i] = {
                    stringifiedDate: `${months[iteration.getMonth()]} ${iteration.getDate()}, ${iteration.getFullYear()}`
                }
            }

            await fbUpdate("/trips/" + id, {
                planner
            })
        }

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

        await fbUpdate("/trips/" + id, {
            city,
            country,
            from,
            to,
            currency: currency[0].currency.code,
            latitude: latLon[0].latitude,
            longitude: latLon[0].longitude
        })

        // IF SUCCESSFUL...

        if (from !== oldFrom || to !== oldTo) {
            store.dispatch(authActions.resetPlanner({
                tripId: id,
                from: from,
                to: to
            }))
        }
        store.dispatch(authActions.editTrip({
            tripId: id,
            city,
            country,
            from,
            to,
            currency,
            latitude: latLon[0].latitude,
            longitude: latLon[0].longitude
        }))
        return null 

    } else if (purpose === "addPlanner") {
        const plannerId = data.get("plannerDate")
        const place = data.get("place")
        const address = data.get("address")
        const notes = data.get("notes")

        const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${geocodingKey}`)
        const json = await res.json()
        const lat = json.features[0].properties.lat
        const lon = json.features[0].properties.lon

        await fbUpdate("/trips/" + id + "/planner/" + plannerId + "/plans/" + purposeId, {
            place,
            address,
            notes,
            lat,
            lon
        })

        // IF SUCCESSFUL...

        store.dispatch(authActions.addPlanner({
            tripId: id,
            plannerId,
            eventId: purposeId,
            place,
            address,
            notes,
            lat,
            lon
        }))

        return null

    } else if (purpose === "editPlanner") {
        const plannerDate = data.get("plannerDate")
        const plannerId = data.get("plannerId")
        const place = data.get("place")
        const address = data.get("address")
        const notes = data.get("notes")

        const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${geocodingKey}`)
        const json = await res.json()
        const lat = json.features[0].properties.lat
        const lon = json.features[0].properties.lon

        await fbUpdate("/trips/" + id + "/planner/" + plannerDate + "/plans/" + plannerId, {
            place,
            address,
            notes,
            lat,
            lon
        })

        // IF SUCCESSFUL...

        store.dispatch(authActions.editPlanner({
            tripId: id,
            plannerDate,
            plannerId,
            place,
            address,
            notes,
            lat,
            lon,
        }))
        return null
    }

}