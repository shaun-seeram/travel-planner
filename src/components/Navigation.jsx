import React from 'react';
import classes from "./Navigation.module.css"
import {Link} from "react-router-dom"

// Consider NavLink?

const Navigation = () => {
    return (
        <div className={classes.sidebar}>
            <h1>Trip Planner</h1>
            <nav>
                <ul>
                    <li><Link to="trips">Trips</Link></li>
                    <li><Link to="trips/add">Add a Trip</Link></li>
                    <li><Link to="auth?mode=register">Sign Up</Link></li>
                    <li><Link to="auth?mode=login">Login</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navigation;
