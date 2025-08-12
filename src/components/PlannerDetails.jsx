import React, { useRef } from 'react';
import PlannerModal from './PlannerModal';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import Button, { add } from '../ui/Button';
import ButtonsRow from '../ui/ButtonsRow';
import classes from "./PlannerDetails.module.css"

const PlannerDetails = ({ trip }) => {

    const plannerRef = useRef();

    const rightContent = (key) => <Button icon={add} fn={() => plannerRef.current.open(key)}>Add Event</Button>

    return (
        <>
            <PlannerModal ref={plannerRef} />
            {trip.planner && Object.keys(trip.planner).map(key => {
                return (
                    <DetailsContainer title={trip.planner[key].stringifiedDate} rightContent={rightContent(key)} showOnOpen>
                        {trip.planner[key].plans && Object.keys(trip.planner[key].plans).map(eventKeys => {
                            const e = trip.planner[key].plans[eventKeys]
                            return (
                                <GrayContainer innerClasses={classes.grayContainer}>
                                    <p className={classes.place}>{e.place}</p>
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
