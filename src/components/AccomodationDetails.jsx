import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import AccomodationModal from './AccomodationModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fbDelete } from '../firebase/authentication';
import { authActions } from '../store';
import classes from "./AccomodationDetails.module.css"

const AcomodationDetails = ({ id }) => {

    const accomodations = useSelector(state => state.auth.trips[id].accomodations || {})
    const dispatch = useDispatch()

    const accomodationRef = useRef()
    let rightContent = Object.keys(accomodations).length !== 1 ? `${Object.keys(accomodations).length} Accomodations` : `${Object.keys(accomodations).length} Accomodation`

    const deleteAccomodation = (accomodationId) => {
        fbDelete("/trips/" + id + "/accomodations/" + accomodationId)
        dispatch(authActions.deleteAccomodation({
            tripId: id,
            accomodationId
        }))
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
                <ul className={classes.list}>
                    {Object.keys(accomodations).map(key => <li className={classes.listItem} key={key}>
                        <span className={classes.name}>{accomodations[key].name}</span> <pre className={classes.address}>{accomodations[key].address}</pre> <button onClick={(() => accomodationRef.current.edit(id, key))}>e</button> <button onClick={() => deleteAccomodation(key)}>d</button></li>)}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default AcomodationDetails;