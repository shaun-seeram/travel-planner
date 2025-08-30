import React from 'react';
import Navigation from '../components/Navigation';
import {Outlet} from "react-router-dom"
import classes from "./RootLayout.module.css"

const RootLayout = () => {

    console.log("Page: RootLayout")

    return (
        <>
            <Navigation />
            <main className={classes.main}>
                <Outlet />
            </main>
        </>
    );
}

export default RootLayout;