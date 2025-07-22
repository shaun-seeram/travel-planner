import React from 'react';
import { useSelector } from 'react-redux';

const Trips = () => {

    const trips = useSelector(state => state.auth.trips)

    return (
        <ul>
            {trips.map((trip) => {
                return <li key="">Hello</li>
            })}
        </ul>
    );
}

export default Trips;
