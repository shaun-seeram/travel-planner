import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"

const AccomodationModal = ({ref}) => {

    const modalRef = useRef();
    const formRef = useRef();

    const closeForm = () => {
        modalRef.current.close()
        formRef.current.reset()
    }

    useImperativeHandle(ref, () => {
        return {
            open() {
                modalRef.current.showModal()
            }
        }
    })

    return (
        <dialog ref={modalRef}>
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
                <button type='submit' name='purpose' value="addFlight">Save</button>
            </Form>
            <button onClick={closeForm}>x</button>
        </dialog>
    );
}

export default AccomodationModal;
