import React from 'react';
import {Form, useSearchParams, useActionData, redirect} from "react-router-dom"
import { verifyEmail, verifyPassword } from '../util';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import auth, { db } from '../firebase/authentication';

const Authentication = () => {

    const [searchParams] = useSearchParams()
    let mode = searchParams.get("mode") || "login"
    if (mode !== "register" && mode !== "login") mode = "login";

    const data = useActionData();

    return (
        <>
        <h1>{mode === "register" ? "Sign Up" : "Login"}</h1>
        <Form method='post'>
            {data?.auth && <p>{data.auth}</p>}
            {data?.email && !data.email.valid && (
                <ul>
                    {data.email.errors.map((err) => <li key={err}>{err}</li>)}
                </ul>
            )}
            <p>
                <label htmlFor="email">Email</label>
                <input name="email" id="email" type="email" />
            </p>
            {data?.password && !data.password.valid && (
                <ul>
                    {data.password.errors.map((err) => <li key={err}>{err}</li>)}
                </ul>
            )}
            <p>
                <label htmlFor="password">Password</label>
                <input name="password" id="password" type="password" />
            </p>
            <button type="submit">{mode === "register" ? "Sign Up" : "Login"}</button>
        </Form>
        </>
    );
}

export default Authentication;

export const action = async ({request}) => {
    const data = await request.formData();
    const url = new URL(window.location.href).searchParams
    const mode = url.get("mode")

    const email = data.get("email");
    const emailValidity = verifyEmail(email);

    const password = data.get("password");
    const passwordValidity = verifyPassword(password);

    if (!emailValidity.valid || !passwordValidity.valid) {
        return {
            email: emailValidity,
            password: passwordValidity
        }
    }

    if (mode === "register") {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password)
            await set(ref(db, user.user.uid + "/"), {
                init: true,
            })
            return redirect("/")
        } catch(e) {
            return {
                auth: e.code === "auth/email-already-in-use" ? "This email is already in use. Please try logging in." : "An error has occured. Please try again later."
            }
        }
    }

    if (mode !== "register") {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            return redirect("/")
        } catch(e) {
            return {
                auth: e.code === "auth/invalid-credential" ? "The email or password is incorrect. Please try again." : "An error has occured. Please try again later."
            }
        }
    }

    return null
}