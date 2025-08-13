import classes from "./Navigation.module.css"
import {Link} from "react-router-dom"
import { useSelector } from 'react-redux';

const Navigation = () => {

    const isLoggedIn = useSelector((state) => state.auth.uid)
    const sessionReady = useSelector((state) => state.auth.sessionReady)

    return (
        <div className={classes.navigation}>
            <h1>TRIPPLANNER</h1>
            <nav>
                <ul>
                <li><Link to="/">Home</Link></li>
                    { (sessionReady && isLoggedIn) && (
                        <>
                            <li><Link to="trips">Trips</Link></li>
                            <li><Link to="trips/add">Add a Trip</Link></li>
                            <li><Link to="settings">Settings</Link></li>
                            <li><Link to="logout">Logout</Link></li>
                        </>
                    )}
                    { (sessionReady && !isLoggedIn) && (
                        <>
                            <li><Link to="auth?mode=register">Sign Up</Link></li>
                            <li><Link to="auth?mode=login">Login</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Navigation;
