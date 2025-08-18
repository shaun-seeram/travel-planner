import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import FlightModal from './FlightModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { ref, remove } from 'firebase/database';
import auth, { db } from '../firebase/authentication';
import { authActions } from '../store';

const FlightDetails = ({ id }) => {

    const flights = useSelector(state => state.auth.trips[id].flights || {})
    const dispatch = useDispatch()

    const flightRef = useRef()
    let rightContent = Object.keys(flights).length !== 1 ? `${Object.keys(flights).length} Flights` : `${Object.keys(flights).length} Flight`

    const deleteFlight = (flightId) => {
        remove(ref(db, auth.currentUser.uid + "/trips/" + id + "/flights/" + flightId))
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
                <ul>
                    {Object.keys(flights).map(key => {
                        return <li key={key}>{flights[key].airline}, {flights[key].boarding}, {flights[key].departureDate}, {flights[key].flightNumber}, {flights[key].fromAirport}, {flights[key].toAirport} <button onClick={() => flightRef.current.edit(id, key)}>e</button> <button onClick={() => deleteFlight(key)}>d</button></li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default FlightDetails;
