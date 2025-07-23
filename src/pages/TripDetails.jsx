import { ref, remove } from 'firebase/database';
import React from 'react';
import {useParams} from "react-router-dom"
import auth, { db } from '../firebase/authentication';

const TripDetails = () => {

    const id = useParams().id

    const handleDelete = () => {
        remove(ref(db, auth.currentUser.uid + "/trips/" + id))
    }

    return (
        <div>
            <h1>{id}</h1>
        </div>
    );
}

export default TripDetails;
