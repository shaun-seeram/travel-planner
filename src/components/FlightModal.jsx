import React, { useImperativeHandle, useRef, useState } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { edit, save } from '../ui/Button';
import { useSelector } from 'react-redux';
import classes from "../ui/Modal.module.css"

const FlightModal = ({ref}) => {

    const modalRef = useRef();
    const formRef = useRef();
    const [ids, setIds] = useState({init: false})
    const editData = useSelector(state => {
        if (ids.init) {
            return state.auth.trips[ids.tripId].flights[ids.flightId]
        } else {
            return null
        }
    })

    useImperativeHandle(ref, () => {
        return {
            open() {
                formRef.current.reset()
                setIds({init: false})
                modalRef.current.open()
            },
            edit(tripId, flightId) {
                formRef.current.reset()
                setIds({
                    init: true,
                    tripId,
                    flightId
                })
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method='post' ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name='flightId' className="sr-only" id='flightId' defaultValue={ids.init ? ids.flightId : ""}></input>
                <span className={classes.formGroup}>
                    <label htmlFor='airline'>Airline</label>
                    <input name='airline' id='airline' defaultValue={ids.init ? editData?.airline : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='fromAirport'>From Airport</label>
                    <input name='fromAirport' id='fromAirport' defaultValue={ids.init ? editData?.fromAirport : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='toAirport'>To Airport</label>
                    <input name='toAirport' id='toAirport' defaultValue={ids.init ? editData?.toAirport : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='flightNumber'>Flight Number</label>
                    <input name='flightNumber' id='flightNumber' defaultValue={ids.init ? editData?.flightNumber : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='departureDate'>Departure Date</label>
                    <input type="date" name='departureDate' id='departureDate' defaultValue={ids.init ? editData?.departureDate : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='boarding'>Boarding Time</label>
                    <input type="time" name='boarding' id='boarding' defaultValue={ids.init ? editData?.boarding : ""}></input>
                </span>
                <span className={classes.buttonsContainer}>
                    {ids.init ? <Button icon={edit} type='submit' name='purpose' value="editFlight">Edit</Button> : <Button icon={save} type='submit' name='purpose' value="addFlight">Save</Button>}
                </span>
            </Form>
        </Modal>
    );
}

export default FlightModal;
