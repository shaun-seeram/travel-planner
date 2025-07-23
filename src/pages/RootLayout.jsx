import React from 'react';
import Navigation from '../components/Navigation';
import {Outlet} from "react-router-dom"
import classes from "./RootLayout.module.css"

import { onAuthStateChanged } from "firebase/auth";
import auth from "../firebase/authentication";

const RootLayout = () => {

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

// export const rootLoader = async () => {
//     const authCheck = async () => {
//         return await new Promise((resolve) => {
//             const unsubscribe = onAuthStateChanged(auth, (user) => {
//                 console.log("ARTIFICIAL DELAY")
//                 unsubscribe()
//                 resolve(user?.uid)
//             })
//         })
//     }

//     return {
//         authCheck: authCheck()
//     }
// }