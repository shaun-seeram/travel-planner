import { useRef } from 'react';
import PlannerModal from './PlannerModal';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import Button from '../ui/buttons/Button';
import { add, edit } from '../ui/buttons/buttonIcons';
import classes from "./PlannerDetails.module.css"
import { useSelector } from 'react-redux';

const PlannerDetails = ({ id }) => {

    console.log("PlannerDetails")

    const planner = useSelector(state => state.trips.trips[id].planner)
    const plannerRef = useRef();

    const rightContent = (key) => <Button icon={add} onClick={() => plannerRef.current.open(key)}>Add Plan</Button>

    return (
        <>
            <PlannerModal id={id} ref={plannerRef} />
            {Object.keys(planner).map(plannerDate => {
                return (
                    <DetailsContainer key={plannerDate} title={planner[plannerDate].stringifiedDate} rightContent={rightContent(plannerDate)} showOnOpen>
                        {planner[plannerDate].plans && Object.keys(planner[plannerDate].plans).map(planId => {
                            const e = planner[plannerDate].plans[planId]
                            return (
                                <GrayContainer key={planId} innerClasses={classes.grayContainer}>
                                    <p className={classes.place}>{e.place} <button className={classes.editButton} onClick={() => plannerRef.current.edit(id, plannerDate, planId)}>{edit}</button></p>
                                    {e.address && <p className={classes.address}>{e.address}</p>}
                                    {e.notes && <p className={classes.notes}>{e.notes}</p>}
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
