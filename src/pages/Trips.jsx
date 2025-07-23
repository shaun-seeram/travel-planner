import React from 'react';
import { useSelector } from 'react-redux';
import {Link} from "react-router-dom"

const Trips = () => {

    const trips = useSelector(state => state.auth.trips)

    return (
        <ul>
            {
                trips && Object.keys(trips).map((key) => {
                    return <li key={key}><Link to={`/trips/${key}`}>{`${trips[key].city}, ${trips[key].country}`}</Link></li>
                })
            }
        </ul>
    );
}

export default Trips;
