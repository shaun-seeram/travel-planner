import React from 'react';

const PlannerDetails = ({trip}) => {

    return (
        <div>
            {trip.planner && Object.keys(trip.planner).map(key => {
                return <p>{trip.planner[key].stringifiedDate}</p>
            })}
        </div>
    );
}

export default PlannerDetails;
