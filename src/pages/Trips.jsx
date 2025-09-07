import { useSelector } from 'react-redux';
import {Link} from "react-router-dom"
import classes from "./Trips.module.css"

const Trips = () => {

    console.log("Page: Trips")

    const trips = useSelector(state => state.auth.trips)

    return (
        <>
            {
                trips && Object.keys(trips).map((key) => {
                    const trip = trips[key]
                    return <Link className={classes.trip} to={`/trips/${key}`} key={key}>
                        <p className={classes.city}>{trip.city}, {trip.country}</p>
                        <p className={classes.date}>{trip.from} - {trip.to}</p>
                    </Link>
                })
            }
        </>
    );
}

export default Trips;
