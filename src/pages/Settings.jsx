import React from 'react';
import { deleteUser } from 'firebase/auth';
import auth, {fbDelete} from "../firebase/authentication"
import {useDispatch} from "react-redux"
import { authActions } from '../store';
import {useNavigate} from "react-router-dom"
import Button, { trash } from '../ui/Button';

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
            <Button icon={trash} fn={deleteAllData}>Delete All Data</Button>
            <Button icon={trash} fn={deleteUserAccount}>Delete Account</Button>
        </div>
    );
}

export default Settings;
