import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';

const FlightModal = ({ref}) => {

    const modalRef = useRef();
    const formRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            open() {
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method='post' ref={formRef} onSubmit={() => modalRef.current.close()}>
                <label htmlFor='airline'>Airline</label>
                <input name='airline' id='airline'></input>
                <label htmlFor='fromAirport'>From Airport</label>
                <input name='fromAirport' id='fromAirport'></input>
                <label htmlFor='toAirport'>To Airport</label>
                <input name='toAirport' id='toAirport'></input>
                <label htmlFor='flightNumber'>Flight Number</label>
                <input name='flightNumber' id='flightNumber'></input>
                <label htmlFor='departureDate'>Departure Date</label>
                <input name='departureDate' id='departureDate'></input>
                <label htmlFor='boarding'>Boarding Time</label>
                <input name='boarding' id='boarding'></input>
                <Button icon={save} type='submit' name='purpose' value="addFlight">Save</Button>
            </Form>
        </Modal>
    );
}

export default FlightModal;
