import React from 'react';
import Navigation from '../components/Navigation';
import {Outlet, redirect} from "react-router-dom"
import classes from "./RootLayout.module.css"
import auth from '../firebase/authentication';
import { onAuthStateChanged } from 'firebase/auth';

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