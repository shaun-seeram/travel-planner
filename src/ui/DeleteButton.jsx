import React from 'react';
import classes from "./Button.module.css"
import { fbDelete } from '../firebase/authentication';
import { useDispatch } from 'react-redux';
import {useNavigate} from "react-router-dom"
import { authActions } from '../store';
import { trash } from './Button';

const DeleteButton = ({id, children, fn, ...props}) => {

    console.log("UI: DeleteButton")

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        fbDelete("/trips/" + id)
        dispatch(authActions.removeTrip(id))
        return navigate("/trips/")
    }

    const classesColor = classes.button + " " + classes.red

    return (
        <button {...props} className={classesColor} onClick={fn || handleDelete}>{trash} {children}</button>
    );
}

export default DeleteButton;