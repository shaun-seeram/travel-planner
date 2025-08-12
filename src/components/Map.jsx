import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { geocodingKey } from '../firebase/authentication';

const Map = ({ trip }) => {

    const keyList = useRef([])
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        Object.keys(trip.planner).forEach(dayId => {
            if (!trip.planner[dayId].plans) return
            return trip.planner[dayId].plans && Object.keys(trip.planner[dayId].plans).forEach(async key => {
                if (key === "stringifiedDate" || keyList.current.includes(key)) return
    
                const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${trip.planner[dayId].plans[key].address}&apiKey=${geocodingKey}`)
                const json = await res.json()

                keyList.current.push(key)
                setMarkers((pv) => [...pv, <Marker position={[json.features[0].properties.lat, json.features[0].properties.lon]}><Popup>{trip.planner[dayId].plans[key].place}</Popup></Marker>])
            })
        })
    }, [trip])

    return (
        <MapContainer center={[trip.latitude, trip.longitude]} style={{ "borderRadius": "10px", height: "250px", width: "100%" }} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[trip.latitude, trip.longitude]}>
                <Popup>{trip.city}, {trip.country}</Popup>
            </Marker>
            {markers}
        </MapContainer>
    );
}

export default Map;
