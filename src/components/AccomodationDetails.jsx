import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import AccomodationModal from './AccomodationModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add } from '../ui/Button';
import { useSelector } from 'react-redux';

const AcomodationDetails = ({ id }) => {

    const accomodations = useSelector(state => state.auth.trips[id].accomodations || {})

    const accomodationRef = useRef()
    let rightContent = Object.keys(accomodations).length !== 1 ? `${Object.keys(accomodations).length} Accomodations` : `${Object.keys(accomodations).length} Accomodation`

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
                    {Object.keys(accomodations).map(key => <li key={key}>{accomodations[key].name}, <pre>{accomodations[key].address}</pre></li>)}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default AcomodationDetails;