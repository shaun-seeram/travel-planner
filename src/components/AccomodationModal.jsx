import React, { useImperativeHandle, useRef, useState } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { edit, save } from '../ui/Button';
import { useSelector } from 'react-redux';
import classes from "../ui/Modal.module.css"

const AccomodationModal = ({ref}) => {

    console.log("AccomodationModal")

    const formRef = useRef();
    const modalRef = useRef();
    const [ids, setIds] = useState({init: false})
    const editData = useSelector(state => {
        if (ids.init) {
            return state.auth.trips[ids.tripId].accomodations[ids.accomodationId]
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
            edit(tripId, accomodationId) {
                formRef.current.reset()
                setIds({
                    init: true,
                    tripId,
                    accomodationId
                })
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form ref={formRef} method='post' onSubmit={() => modalRef.current.close()}>
                <input name='accomodationId' className="sr-only" id='accomodationId' defaultValue={ids.init ? ids.accomodationId : undefined} readOnly></input>
                <span className={classes.formGroup}>
                    <label htmlFor='name'>Name</label>
                    <input name='name' id='name' defaultValue={ids.init ? editData?.name : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='street'>Street</label>
                    <input name='street' id='street' defaultValue={ids.init ? editData?.street : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='city'>City</label>
                    <input name='city' id='city' defaultValue={ids.init ? editData?.city : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='state'>State/Province</label>
                    <input name='state' id='state' defaultValue={ids.init ? editData?.state : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='zip'>Zip Code</label>
                    <input name='zip' id='zip' defaultValue={ids.init ? editData?.zip : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='notes'>Notes</label>
                    <textarea rows="5" name='notes' id='notes' defaultValue={ids.init ? editData?.notes : ""}></textarea>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={ids.init ? edit : save} type='submit' name='purpose' value="updateAccomodation">{ids.init ? "Edit" : "Save"}</Button>
                </span>
            </Form>
        </Modal>
    );
}

export default AccomodationModal;