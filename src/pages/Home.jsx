import React from 'react';
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"

const Home = () => {

    const state = useSelector(state => state.auth.trips)

    return (
        <div>
            <p>This is the main page. This will be a general description of the project...</p>
            <p>...followed by a list of trips if already logged in...</p>
            <p><small>...or some other design if I can decide on what to actually do with this page.</small></p>
            <div>
                <h2>Upcoming Trips</h2>
                {Object.keys(state).length === 0 && <p>No upcoming trips</p>}
                {Object.keys(state).map(key => {
                    const trip = state[key]
                    return (
                        <Link to={`/trips/${key}`} key={key}>
                            <p>{trip.city}, {trip.country}</p>
                            <p>{trip.from} - {trip.to}</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default Home;