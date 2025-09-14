import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import {Outlet} from "react-router-dom"
import classes from "./RootLayout.module.css"
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