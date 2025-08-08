import React from 'react';

const PlannerDetails = ({trip}) => {

    const from = new Date(trip.from.split("-"))
    const to = new Date (trip.to.split("-"))

    const datesArr = []

    for (let i = from.getTime(); i <= (to.getTime()); i += 86400000) {
        datesArr.push(new Date(i))
    }

    return (
        <div>
            {datesArr.map(date => {
                return <p>{date.toString()}</p>
            })}
        </div>
    );
}

export default PlannerDetails;
