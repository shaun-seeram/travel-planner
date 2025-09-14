import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import FlightModal from './FlightModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button from '../ui/buttons/Button';
import { add, edit, trash } from '../ui/buttons/buttonIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fbDelete } from '../firebase/authentication';
import { authActions } from '../store';
import classes from "./FlightDetails.module.css"
import RoundButton from "../ui/buttons/RoundButton"

const FlightDetails = ({ id }) => {

console.log("FlightDetails")
    
    const flights = useSelector(state => state.auth.trips[id].flights || {})
    const dispatch = useDispatch()

    const flightRef = useRef()
    let rightContent = Object.keys(flights).length !== 1 ? `${Object.keys(flights).length} Flights` : `${Object.keys(flights).length} Flight`

    const deleteFlight = (flightId) => {
        fbDelete("/trips/" + id + "/flights/" + flightId)
        dispatch(authActions.deleteFlight({
            tripId: id,
            flightId
        }))
    }

    return (
        <>
            <FlightModal ref={flightRef} />

            <DetailsContainer title="Flights" rightContent={rightContent}>
                <GrayContainer>
                    <ButtonsRow>
                        <Button icon={add} onClick={() => flightRef.current.open()}>Add Flight</Button>
                    </ButtonsRow>
                </GrayContainer>
                <ul className={classes.list}>
                    {Object.keys(flights).map(key => {
                        return <li className={classes.listItem} key={key}>
                            <div><span className={classes.from}>{flights[key].fromAirport}</span> <span className={classes.to}>{" >"} {flights[key].toAirport}</span></div>
                            <span className={classes.airline}>{flights[key].airline} ({flights[key].flightNumber})</span>
                            <div className={classes.boarding}>{flights[key].departureDate} at {flights[key].stringifiedBoarding}</div>
                            { flights[key].notes && <div className={classes.notes}><pre>{flights[key].notes}</pre></div> }
                            <div className={classes.buttonContainer}>
                                <RoundButton icon={edit} onClick={() => flightRef.current.edit(id, key)} />
                                <RoundButton icon={trash} onClick={() => deleteFlight(key)} />
                            </div>
                        </li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default FlightDetails;
