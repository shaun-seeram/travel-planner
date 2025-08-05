import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const Map = ({trip}) => {

    return (
        <MapContainer center={[trip.latitude, trip.longitude]} style={{ "borderRadius": "10px", height: "250px", width: "100%" }} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[trip.latitude, trip.longitude]}>
                <Popup>{trip.city}, {trip.country}</Popup>
            </Marker>
        </MapContainer>
    );
}

export default Map;
