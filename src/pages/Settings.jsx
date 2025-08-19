import React from 'react';
import { deleteUser } from 'firebase/auth';
import auth, {fbDelete} from "../firebase/authentication"
import {useDispatch} from "react-redux"
import { authActions } from '../store';
import {useNavigate} from "react-router-dom"

const Settings = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const deleteAllData = () => {
        fbDelete("/trips/")
        dispatch(authActions.deleteAllData())
    }

    const deleteUserAccount = () => {
        fbDelete()
        dispatch(authActions.deleteAllData())
        deleteUser(auth.currentUser)
        return navigate("/")
    }

    return (
        <div>
            <button onClick={deleteAllData}>Delete All Data</button>
            <button onClick={deleteUserAccount}>Delete Account</button>
        </div>
    );
}

export default Settings;
