import React from 'react';
import {ref, remove} from "firebase/database"
import { deleteUser } from 'firebase/auth';
import auth, {db} from "../firebase/authentication"
import {useDispatch, useSelector} from "react-redux"
import { authActions } from '../store';
import {useNavigate} from "react-router-dom"

const Settings = () => {

    const uid = useSelector(state => state.auth.uid)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const deleteAllData = () => {
        remove(ref(db,"/" + uid + "/trips"))
        dispatch(authActions.deleteAllData())
    }

    const deleteUserAccount = () => {
        remove(ref(db,"/" + uid))
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
