import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import classes from "./Home.module.css"

const Home = () => {

    console.log("Page: Home")

    const uid = useSelector(state => state.auth.uid)
    const trips = useSelector(state => state.auth.trips)

    return (
        <div>
            <p>This is the main page. This will be a general description of the project...</p>
            <p>...followed by a list of trips if already logged in...</p>
            <p><small>...or some other design if I can decide on what to actually do with this page.</small></p>
            <div>
                { uid &&
                    <>
                        <h2>Upcoming Trips</h2>
                        <div className={classes.tripContainer}>
                            {Object.keys(trips).length === 0 && <p>No upcoming trips</p>}
                            {Object.keys(trips).map(key => {
                                const trip = trips[key]
                                return (
                                    <Link className={classes.trip} to={`/trips/${key}`} key={key}>
                                        <p className={classes.city}>{trip.city}, {trip.country}</p>
                                        <p className={classes.date}>{trip.from} - {trip.to}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default Home;