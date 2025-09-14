import { useImperativeHandle, useRef, useState } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button from '../ui/buttons/Button';
import { edit, save } from '../ui/buttons/buttonIcons';
import { useSelector } from 'react-redux';
import classes from "../ui/Modal.module.css"

const FlightModal = ({ref}) => {

    console.log("FlightModal")

    const modalRef = useRef();
    const formRef = useRef();
    const [ids, setIds] = useState(false)
    const editData = useSelector(state => {
        if (ids) {
            return state.auth.trips[ids.tripId].flights[ids.flightId]
        } else {
            return null
        }
    })

    useImperativeHandle(ref, () => {
        return {
            open() {
                formRef.current.reset()
                setIds(false)
                modalRef.current.open()
            },
            edit(tripId, flightId) {
                formRef.current.reset()
                setIds({
                    tripId,
                    flightId
                })
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef}>
            <Form method='post' ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name='flightId' className="sr-only" id='flightId' defaultValue={ids ? ids.flightId : undefined} readOnly></input>
                <span className={classes.formGroup}>
                    <label htmlFor='airline'>Airline</label>
                    <input name='airline' id='airline' defaultValue={ids ? editData?.airline : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='fromAirport'>From Airport</label>
                    <input name='fromAirport' id='fromAirport' defaultValue={ids ? editData?.fromAirport : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='toAirport'>To Airport</label>
                    <input name='toAirport' id='toAirport' defaultValue={ids ? editData?.toAirport : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='flightNumber'>Flight Number</label>
                    <input name='flightNumber' id='flightNumber' defaultValue={ids ? editData?.flightNumber : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='departureDate'>Departure Date</label>
                    <input type="date" name='departureDate' id='departureDate' defaultValue={ids ? editData?.departureDate : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='boarding'>Boarding Time</label>
                    <input type="time" name='boarding' id='boarding' defaultValue={ids ? editData?.boarding : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='notes'>Notes</label>
                    <textarea name='notes' id='notes' rows="5" defaultValue={ids ? editData?.notes : ""}></textarea>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={ids ? edit : save} type='submit' name='purpose' value="updateFlight">{ids ? "Edit" : "Save"}</Button>
                </span>
            </Form>
        </Modal>
    );
}

export default FlightModal;
