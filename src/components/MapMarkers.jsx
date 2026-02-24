import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet'
import { useSelector } from 'react-redux';

const MapMarkers = ({ id }) => {

    console.log("MapMarkers")

    const trip = useSelector(state => state.trips.trips[id].planner)
    const accomodations = useSelector(state => state.trips.trips[id].accomodations)
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        setMarkers([])
        Object.keys(trip).forEach(dayId => {
            if (!trip[dayId].plans) return
            return Object.keys(trip[dayId].plans).forEach(key => {
                if (key === "stringifiedDate" || !trip[dayId].plans[key].lat) return
                setMarkers((pv) => [...pv, trip[dayId].plans[key]])
            })
        })
        if (!accomodations) return
        Object.keys(accomodations).forEach(accomodation => {
            if (!accomodations[accomodation].lat) return
            setMarkers((pv) => [...pv, {
                place: accomodations[accomodation].name,
                lat: accomodations[accomodation].lat,
                lon: accomodations[accomodation].lon
            }])
        })
    }, [trip, accomodations])

    return (
        <>
            {markers.map(marker => {
                return (
                    <Marker key={marker.lat + marker.lon} position={[marker.lat, marker.lon]}>
                        <Popup>{marker.place}</Popup>
                    </Marker>
                )
            })}
        </>
    );
}

export default MapMarkers;
