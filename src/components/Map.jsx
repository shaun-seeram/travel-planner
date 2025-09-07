import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useSelector } from 'react-redux';
import MapMarkers from "./MapMarkers"

const Map = ({ id }) => {

    console.log("Map")

    const latitude = useSelector(state => state.auth.trips[id].latitude)
    const longitude = useSelector(state => state.auth.trips[id].longitude)
    const city = useSelector(state => state.auth.trips[id].city)
    const country = useSelector(state => state.auth.trips[id].country)

    return (
        <MapContainer key={latitude} center={[latitude, longitude]} style={{ "borderTopLeftRadius": "10px", "borderTopRightRadius": "10px", height: "250px", width: "100%" }} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
                <Popup>{city}, {country}</Popup>
            </Marker>
            <MapMarkers id={id} />
        </MapContainer>
    );
}

export default Map;
