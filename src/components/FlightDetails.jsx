import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import FlightModal from './FlightModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add } from '../ui/Button';
import { useSelector } from 'react-redux';

const FlightDetails = ({ id }) => {

    const flights = useSelector(state => state.auth.trips[id].flights || {})

    const flightRef = useRef()
    let rightContent = Object.keys(flights).length !== 1 ? `${Object.keys(flights).length} Flights` : `${Object.keys(flights).length} Flight`

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
                        return <li key={key}>{flights[key].airline}, {flights[key].boarding}, {flights[key].departureDate}, {flights[key].flightNumber}, {flights[key].fromAirport}, {flights[key].toAirport}</li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default FlightDetails;
