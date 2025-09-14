import { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import AccomodationModal from './AccomodationModal';
import ButtonsRow from "../ui/ButtonsRow"
import Button from '../ui/buttons/Button';
import { add, edit, trash } from '../ui/buttons/buttonIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fbDelete } from '../firebase/authentication';
import { authActions } from '../store';
import classes from "./AccomodationDetails.module.css"
import RoundButton from "../ui/buttons/RoundButton"

const AccomodationDetails = ({ id }) => {

    console.log("AccomodationDetails")

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
                        <Button icon={add} onClick={() => accomodationRef.current.open()}>Add Accomodation</Button>
                    </ButtonsRow>
                </GrayContainer>
                <ul className={classes.list}>
                    {Object.keys(accomodations).map(key => <li className={classes.listItem} key={key}>
                        <span className={classes.name}>{accomodations[key].name}</span> 
                        <address className={classes.address}>
                            {accomodations[key].street} <br />
                            {accomodations[key].city}, {accomodations[key].state} <br />
                            {accomodations[key].zip} <br />
                        </address>
                        { accomodations[key].notes && <div className={classes.notes}>
                            <pre>{accomodations[key].notes}</pre> 
                        </div> }
                        <div className={classes.buttonContainer}>
                                <RoundButton icon={edit} onClick={() => accomodationRef.current.edit(id, key)} />
                                <RoundButton icon={trash} onClick={() => deleteAccomodation(key)} />
                        </div>
                    </li>)}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default AccomodationDetails;