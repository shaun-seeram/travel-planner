import { ref, update } from 'firebase/database';
import React, { useEffect, useRef } from 'react';
import { useParams, useLoaderData, useActionData, Form } from "react-router-dom"
import auth, { db } from '../firebase/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, store } from '../store';
import classes from "./TripDetails.module.css"
import AccomodationModal from '../components/AccomodationModal';
import FlightModal from "../components/FlightModal"
import ExpenseModal from "../components/ExpenseModal"
import BudgetModal from '../components/BudgetModal';
import Map from '../components/Map';
import TitleContainer from '../components/TitleContainer';

const TripDetails = () => {

    const actionData = useActionData()
    const currency = useLoaderData()
    const id = useParams().id
    const trip = useSelector(state => state.auth.trips[id])
    const dispatch = useDispatch()

    const accomodationRef = useRef()
    const flightRef = useRef()
    const expenseRef = useRef()
    const budgetRef = useRef()

    useEffect(() => {
        if (actionData && actionData.purpose === "addAccomodation") {
            dispatch(authActions.addAccomodation({
                tripId: id,
                accomodationId: actionData.purposeId,
                accomodation: actionData.accomodation
            }))
        } else if (actionData && actionData.purpose === "addFlight") {
            dispatch(authActions.addFlight({
                tripId: id,
                flightId: actionData.purposeId,
                flight: actionData.flight
            }))
        } else if (actionData && actionData.purpose === "editBudget") {
            dispatch(authActions.editBudget({
                tripId: id,
                budget: actionData.budget
            }))
        } else if (actionData && actionData.purpose === "addExpense") {
            dispatch(authActions.addExpense({
                tripId: id,
                expenseId: actionData.purposeId,
                expense: actionData.expense
            }))
        }
    }, [actionData, dispatch, id])

    return (
        <>
            <Map trip={trip} />
            <TitleContainer id={id} trip={trip} />


            <AccomodationModal ref={accomodationRef} />
            <FlightModal ref={flightRef} />
            <ExpenseModal ref={expenseRef} />
            <BudgetModal defaultValue={trip.budget.budget} ref={budgetRef} />



            <div className={classes.split}>
                <div className={classes.half}>
                    
                    <div className={classes.budgetContainer}>
                        <p>1 CAD = {currency} {trip.currency}</p>
                    </div>

                    <div>
                        <details open>
                            <summary>
                                Budget
                                <div className={classes.summaryRight}>
                                    ${trip.budget.expenses ? (
                                        Object.keys(trip.budget.expenses).reduce((pT, cT) => {
                                            return pT + trip.budget.expenses[cT].cost
                                        }, 0)
                                    ) : 0} / {trip.budget.budget}
                                </div>
                            </summary>
                            <div className={classes.budgetContainer}>
                                <h1>${trip.budget.expenses ? (
                                    Object.keys(trip.budget.expenses).reduce((pT, cT) => {
                                        return pT + trip.budget.expenses[cT].cost
                                    }, 0)
                                ) : 0}</h1>
                                <progress value={trip.budget.expenses ? (
                                    Object.keys(trip.budget.expenses).reduce((pT, cT) => {
                                        return pT + trip.budget.expenses[cT].cost
                                    }, 0)
                                ) : 0} max={trip.budget.budget}></progress>
                                <p>Budget: ${trip.budget.budget}</p>
                                <div className={classes.buttonsRow}>
                                    <button onClick={() => expenseRef.current.open()}>Add Expense</button>
                                    <button onClick={() => budgetRef.current.open()}>Edit Budget</button>
                                </div>
                            </div>
                            <ul>
                                {Object.keys(trip.budget.expenses).map(key => {
                                    const expense = trip.budget.expenses[key]
                                    return <li>{expense.name}, {expense.cost}</li>
                                })}
                            </ul>
                        </details>
                    </div>

                    <div>
                        <details open>
                            <summary>
                                Flights
                                <div className={classes.summaryRight}>
                                    {trip.flights && Object.keys(trip.flights).length > 1 ? `${Object.keys(trip.flights).length} Flights` : `${Object.keys(trip.flights).length} Flight`}
                                </div>
                            </summary>
                            <div className={classes.budgetContainer}>
                                <div className={classes.buttonsRow}>
                                    <button onClick={() => flightRef.current.open()}>Add Flight</button>
                                </div>
                            </div>
                            <ul>
                                {Object.keys(trip.flights).map(key => {
                                    const flight = trip.flights[key]
                                    return <li>{flight.airline}, {flight.boarding}, {flight.departureDate}, {flight.flightNumber}, {flight.fromAirport}, {flight.toAirport}</li>
                                })}
                            </ul>
                        </details>
                    </div>


                    <div>
                        <details open>
                            <summary>
                                Accomodations
                                <div className={classes.summaryRight}>
                                    {trip.accomodations && Object.keys(trip.accomodations).length > 1 ? `${Object.keys(trip.accomodations).length} Accomodations` : `${Object.keys(trip.accomodations).length} Accomodation`}
                                </div>
                            </summary>
                            <div className={classes.budgetContainer}>
                                <div className={classes.buttonsRow}>
                                    <button onClick={() => accomodationRef.current.open()}>Add Accomodation</button>
                                </div>
                            </div>
                            <ul>
                                {Object.keys(trip.accomodations).map(key => {
                                    const accomodation = trip.accomodations[key]
                                    return <li>{accomodation.name}, <pre>{accomodation.address}</pre></li>
                                })}
                            </ul>
                        </details>
                    </div>




                </div>
                <div className={`${classes.half} ${classes.halfRight}`}>
                    <h3>Planner</h3>
                    This will be planner
                </div>
            </div>

        </>
    );
}

export default TripDetails;

export const tripDetailsLoader = async ({ _, params }) => {
    const trips = store.getState().auth.trips[params.id].currency
    const res = await fetch(`https://api.fxratesapi.com/convert?from=CAD&to=${trips}&date=2012-06-24&amount=1&format=json`)
    const resJson = await res.json();
    return resJson.result.toFixed(2) || null
}

export const tripDetailsAction = async ({ request, params }) => {
    const data = await request.formData();
    const purpose = data.get("purpose")
    const purposeId = new Date().getTime()
    const id = params.id

    if (purpose === "addAccomodation") {
        const name = data.get("name")
        const address = data.get("address")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/accomodations/" + purposeId), {
            name,
            address
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            purposeId,
            accomodation: {
                name,
                address
            }
        }

    } else if (purpose === "addFlight") {
        const airline = data.get("airline")
        const fromAirport = data.get("fromAirport")
        const toAirport = data.get("toAirport")
        const flightNumber = data.get("flightNumber")
        const departureDate = data.get("departureDate")
        const boarding = data.get("boarding")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/flights/" + purposeId), {
            airline,
            fromAirport,
            toAirport,
            flightNumber,
            departureDate,
            boarding
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            purposeId,
            flight: {
                airline,
                fromAirport,
                toAirport,
                flightNumber,
                departureDate,
                boarding
            }
        }
    } else if (purpose === "editBudget") {
        const budget = data.get("budget")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/budget/"), {
            budget: +budget
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            budget: +budget
        }
    } else if (purpose === "addExpense") {
        const name = data.get("expenseName")
        const cost = data.get("expenseCost")

        await update(ref(db, auth.currentUser.uid + "/trips/" + id + "/budget/expenses/" + purposeId), {
            name,
            cost: +cost
        })

        // IF SUCCESSFUL...
        return {
            purpose,
            purposeId,
            expense: {
                name,
                cost: +cost
            }
        }
    }








}