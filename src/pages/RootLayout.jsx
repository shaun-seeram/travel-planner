import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import {Outlet, redirect} from "react-router-dom"
import classes from "./RootLayout.module.css"
import auth from '../firebase/authentication';
import { onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

const RootLayout = () => {

    console.log("Page: RootLayout")

    const [showLoader, setShowLoader] = useState(false)
    const sessionReady = useSelector(state => state.auth.sessionReady)

    useEffect(() => {
        setTimeout(() => {
            setShowLoader(true)
        }, 1000)
    }, [])

    return (
        <>
            <Navigation />
            <main className={classes.main}>
                { sessionReady ? <Outlet /> : showLoader && <Loader />}
            </main>
        </>
    );
}

export default RootLayout;