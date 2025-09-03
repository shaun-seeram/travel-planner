import React from 'react';
import Navigation from '../components/Navigation';
import {Outlet, redirect} from "react-router-dom"
import classes from "./RootLayout.module.css"
import auth from '../firebase/authentication';
import { onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

const RootLayout = () => {

    console.log("Page: RootLayout")
    const sessionReady = useSelector(state => state.auth.sessionReady)

    return (
        <>
            <Navigation />
            <main className={classes.main}>
                { sessionReady ? <Outlet /> : <Loader />}
            </main>
        </>
    );
}

export default RootLayout;