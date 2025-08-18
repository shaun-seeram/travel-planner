import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useSelector } from 'react-redux';

const Map = ({ id }) => {

    const trip = useSelector(state => state.auth.trips[id])
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        setMarkers([])
        Object.keys(trip.planner).forEach(dayId => {
            if (!trip.planner[dayId].plans) return
            return Object.keys(trip.planner[dayId].plans).forEach(key => {
                if (key === "stringifiedDate" || !trip.planner[dayId].plans[key].lat) return
                setMarkers((pv) => [...pv, trip.planner[dayId].plans[key]])
            })
        })
    }, [trip.planner])

    return (
        <MapContainer center={[trip.latitude, trip.longitude]} style={{ "borderRadius": "10px", height: "250px", width: "100%" }} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[trip.latitude, trip.longitude]}>
                <Popup>{trip.city}, {trip.country}</Popup>
            </Marker>
            {markers.map(marker => {
                return (
                    <Marker key={marker.lat + marker.lon} position={[marker.lat, marker.lon]}>
                        <Popup>{marker.place}</Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    );
}

export default Map;
