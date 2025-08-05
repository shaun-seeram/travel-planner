import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import FlightModal from './FlightModal';
import ButtonsRow from "../ui/ButtonsRow"

const FlightDetails = ({ trip }) => {

    const flightRef = useRef()
    const rightContent = trip.flights && Object.keys(trip.flights).length > 1 ? `${Object.keys(trip.flights).length} Flights` : `${Object.keys(trip.flights).length} Flight`

    return (
        <>
            <FlightModal ref={flightRef} />

            <DetailsContainer title="Flights" rightContent={rightContent}>
                <GrayContainer>
                    <ButtonsRow>
                        <button onClick={() => flightRef.current.open()}>Add Flight</button>
                    </ButtonsRow>
                </GrayContainer>
                <ul>
                    {Object.keys(trip.flights).map(key => {
                        const flight = trip.flights[key]
                        return <li>{flight.airline}, {flight.boarding}, {flight.departureDate}, {flight.flightNumber}, {flight.fromAirport}, {flight.toAirport}</li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default FlightDetails;
