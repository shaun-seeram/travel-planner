import { ref, remove } from 'firebase/database';
import React from 'react';
import {useParams, useNavigate, useLoaderData} from "react-router-dom"
import auth, { db, latlonkey } from '../firebase/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, store } from '../store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const date = new Date();

const TripDetails = () => {

    const currency = useLoaderData()
    const id = useParams().id
    const trip = useSelector(state => state.auth.trips[id])
    const navigate = useNavigate()
    const dispatch = useDispatch()

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