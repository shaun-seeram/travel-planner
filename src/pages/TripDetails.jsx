import { child, push, ref, remove, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {useParams, useNavigate, useLoaderData, useActionData, Form} from "react-router-dom"
import auth, { db, latlonkey } from '../firebase/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, store } from '../store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const date = new Date();

const TripDetails = () => {

    const actionData = useActionData()
    const currency = useLoaderData()
    const id = useParams().id
    const trip = useSelector(state => state.auth.trips[id])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [accomodationAdd, setAccomodationAdd] = useState(false);
    const [flightAdd, setFlightAdd] = useState(false);
    const [editBudget, setEditBudget] = useState(false);

    useEffect(() => {
        setAccomodationAdd(false)
        setFlightAdd(false)
        setEditBudget(false)
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
        }
    }, [actionData, dispatch, id])

    const handleDelete = () => {
        remove(ref(db, auth.currentUser.uid + "/trips/" + id))
        dispatch(authActions.removeTrip(id))
        return navigate("/trips/")
    }

    const calculateDaysToGo = () => {
        const todaysDate = new Date(date).getTime()
        const toDate = new Date(trip.to).getTime()
        return Math.floor((toDate - todaysDate) / 86400000)
    }

    return (
        <>
        <MapContainer center={[trip.latitude, trip.longitude]} zoomControl={false} style={{height: "200px", width: "100%"}} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[trip.latitude, trip.longitude]}>
                <Popup>{trip.city}, {trip.country}</Popup>
            </Marker>
        </MapContainer>

            <button onClick={handleDelete}>Delete</button>
            <div>
                <h1>{trip.city}, {trip.country}</h1>
                <p>{trip.from} - {trip.to}</p>
                <p>Today's Date: {date.toLocaleDateString()} | Days to go: {calculateDaysToGo()}</p>
                <p>1 CAD = {currency} {trip.currency}</p>
            </div>

            <div>
                <h2>Accomodations:</h2>
                {trip.accomodations && Object.keys(trip.accomodations).map((key) => {
                    return (
                        <div key={key}>
                            <p>{trip.accomodations[key].name}</p>
                            <pre>{trip.accomodations[key].address}</pre>
                        </div>
                    )
                })}
                { accomodationAdd && <Form method='post'>
                    <label htmlFor='name'>Name</label>
                    <input name='name' id='name'></input>
                    <label htmlFor='address'>Address</label>
                    <textarea name='address' id='address' rows="4"></textarea>
                    <button type='submit' name='purpose' value="addAccomodation">Save</button>
                </Form> }
                <button onClick={() => setAccomodationAdd(prevValue => !prevValue)}>Add?</button>
            </div>

            <div>
                <h2>Flights:</h2>
                {trip.flights && Object.keys(trip.flights).map((key) => {
                    return (
                        <div key={key}>
                            <p>{trip.flights[key].airline}</p>
                            <p>{trip.flights[key].fromAirport}</p>
                            <p>{trip.flights[key].toAirport}</p>
                            <p>{trip.flights[key].flightNumber}</p>
                            <p>{trip.flights[key].departureDate}</p>
                            <p>{trip.flights[key].boarding}</p>

                        </div>
                    )
                })}
                { flightAdd && <Form method='post'>
                    <label htmlFor='airline'>Airline</label>
                    <input name='airline' id='airline'></input>
                    <label htmlFor='fromAirport'>From Airport</label>
                    <input name='fromAirport' id='fromAirport'></input>
                    <label htmlFor='toAirport'>To Airport</label>
                    <input name='toAirport' id='toAirport'></input>
                    <label htmlFor='flightNumber'>Flight Number</label>
                    <input name='flightNumber' id='flightNumber'></input>
                    <label htmlFor='departureDate'>Departure Date</label>
                    <input name='departureDate' id='departureDate'></input>
                    <label htmlFor='boarding'>Boarding Time</label>
                    <input name='boarding' id='boarding'></input>
                    <button type='submit' name='purpose' value="addFlight">Save</button>
                </Form> }
                <button onClick={() => setFlightAdd(prevValue => !prevValue)}>Add?</button>
            </div>

            <div>
                <h2>Budget:</h2>
                <h3>Budget: {editBudget ? (
                    <Form method='post'>
                        <label htmlFor='budget' className='sr-only'>Budget</label>
                        <input name='budget' id='budget' type='number' defaultValue={trip.budget.budget}></input>
                        <button type='submit' name='purpose' value="editBudget">Save</button>
                    </Form>
                ) : trip.budget.budget}</h3>
                <button onClick={() => setEditBudget(prevValue => !prevValue)}>Edit?</button>
                
                <h3>Savings: {trip.budget.savings ? (
                    trip.budget.savings?.reduce((pT, cT) => {
                        return pT + cT
                    }, 0)
                ) : 0}</h3>
                <progress value={trip.budget.savings ? (
                    trip.budget.savings?.reduce((pT, cT) => {
                        return pT + cT
                    }, 0)
                ) : 0} max={trip.budget.budget}></progress>
            </div>
        </>
    );
}

export default TripDetails;

export const tripDetailsLoader = async ({_, params}) => {
    const trips = store.getState().auth.trips[params.id].currency
    const res = await fetch(`https://api.fxratesapi.com/convert?from=CAD&to=${trips}&date=2012-06-24&amount=1&format=json`)
    const resJson = await res.json();
    return resJson.result.toFixed(2) || null
}

export const tripDetailsAction = async ({request, params}) => {
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
    }

    


    
    


}