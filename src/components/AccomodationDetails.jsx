import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import AccomodationModal from './AccomodationModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add } from '../ui/Button';

const AcomodationDetails = ({ trip }) => {

    const accomodationRef = useRef()
    let rightContent

    if (trip.accomodations) {
        rightContent = Object.keys(trip.accomodations).length > 1 ? `${Object.keys(trip.accomodations).length} Accomodations` : `${Object.keys(trip.accomodations).length} Accomodation`
    }

    return (
        <>
            <AccomodationModal ref={accomodationRef} />

            <DetailsContainer title="Accomodations" rightContent={rightContent}>
                <GrayContainer>
                    <ButtonsRow>
                        <Button icon={add} fn={() => accomodationRef.current.open()}>Add Accomodation</Button>
                    </ButtonsRow>
                </GrayContainer>
                <ul>
                    {trip.accomodations && Object.keys(trip.accomodations).map(key => {
                        const accomodation = trip.accomodations[key]
                        return <li>{accomodation.name}, <pre>{accomodation.address}</pre></li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default AcomodationDetails;