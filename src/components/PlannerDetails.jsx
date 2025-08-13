import React, { useRef } from 'react';
import PlannerModal from './PlannerModal';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import Button, { add, edit } from '../ui/Button';
import classes from "./PlannerDetails.module.css"

const PlannerDetails = ({ trip }) => {

    const plannerRef = useRef();

    const rightContent = (key) => <Button icon={add} fn={() => plannerRef.current.open(key)}>Add Plan</Button>

    return (
        <>
            <PlannerModal ref={plannerRef} />
            {trip.planner && Object.keys(trip.planner).map(key => {
                return (
                    <DetailsContainer title={trip.planner[key].stringifiedDate} rightContent={rightContent(key)} showOnOpen>
                        {trip.planner[key].plans && Object.keys(trip.planner[key].plans).map(eventKey => {
                            const e = trip.planner[key].plans[eventKey]
                            return (
                                <GrayContainer innerClasses={classes.grayContainer}>
                                    <p className={classes.place}>{e.place} <button className={classes.editButton} onClick={() => plannerRef.current.edit(key, eventKey, { place: e.place, address: e.address, notes: e.notes })}>{edit}</button></p>
                                    <p className={classes.address}>{e.address}</p>
                                    <p className={classes.notes}>{e.notes}</p>
                                </GrayContainer>
                            )
                        })}
                    </DetailsContainer>
                )
            })}
        </>
    );
}

export default PlannerDetails;
