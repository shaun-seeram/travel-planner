import React, { useRef } from 'react';
import EditModal from './EditModal';
import classes from "./TitleContainer.module.css"
import { edit } from '../ui/Button';
import { useSelector } from 'react-redux';

const date = new Date();

const TitleContainer = ({id}) => {

    console.log("TitleContainer")

    const trip = useSelector(state => state.auth.trips[id])
    const editRef = useRef()

    const calculateDaysToGo = () => {
        const todaysDate = new Date(date).getTime()
        const toDate = new Date(trip.to).getTime()
        return Math.floor((toDate - todaysDate) / 86400000)
    }

    return (
        <>
            <EditModal id={id} trip={trip} ref={editRef} />
            <div className={classes.titleContainer}>
                <div>
                    <h2>Trip to {trip.city}, {trip.country}</h2>
                    <p>{trip.from} - {trip.to} <button onClick={() => editRef.current.open()}>{edit}</button></p>
                </div>
                {
                    calculateDaysToGo() >= 0 && <div className={classes.countdown}>
                        <p className={classes.countdownCircle}>{calculateDaysToGo()}</p>
                        <p className={classes.countdownDTG}>Days to go</p>
                    </div>
                }
            </div>
        </>
    );
}

export default TitleContainer;
