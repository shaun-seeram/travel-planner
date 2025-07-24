import { ref, remove } from 'firebase/database';
import React from 'react';
import {useParams, useNavigate} from "react-router-dom"
import auth, { db } from '../firebase/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const TripDetails = () => {

    const id = useParams().id
    const trip = useSelector(state => state.auth.trips[id])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleDelete = () => {
        remove(ref(db, auth.currentUser.uid + "/trips/" + id))
        dispatch(authActions.removeTrip(id))
        navigate("/trips/")
    }

    return (
        <>
        <MapContainer center={[trip.latitude, trip.longitude]} style={{height: "200px", width: "100%"}} zoom={13} scrollWheelZoom={false}>
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
                <p>Today's Date: {new Date().toLocaleDateString()} | Days to go: xx</p>
            </div>
        </>
    );
}

export default TripDetails;

// export const tripDetailsLoader = () => {

// }