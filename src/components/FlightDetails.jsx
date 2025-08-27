import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import FlightModal from './FlightModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fbDelete } from '../firebase/authentication';
import { authActions } from '../store';
import classes from "./FlightDetails.module.css"

const FlightDetails = ({ id }) => {

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
                        <Button icon={add} fn={() => flightRef.current.open()}>Add Flight</Button>
                    </ButtonsRow>
                </GrayContainer>
                <ul className={classes.list}>
                    {Object.keys(flights).map(key => {
                        return <li className={classes.listItem} key={key}>
                            <div><span className={classes.from}>{flights[key].fromAirport}</span> <span className={classes.to}>{" >"} {flights[key].toAirport}</span></div>
                            <span className={classes.airline}>{flights[key].airline} ({flights[key].flightNumber})</span>
                            <div className={classes.boarding}>{flights[key].departureDate} at {flights[key].boarding}</div>
                            
                            <button onClick={() => flightRef.current.edit(id, key)}>e</button>
                            <button onClick={() => deleteFlight(key)}>d</button>
                        </li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default FlightDetails;
