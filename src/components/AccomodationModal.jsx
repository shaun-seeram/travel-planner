import { useImperativeHandle, useRef, useState } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button from '../ui/buttons/Button';
import { edit, save } from '../ui/buttons/buttonIcons';
import { useSelector } from 'react-redux';
import classes from "../ui/Modal.module.css"

const AccomodationModal = ({ref}) => {

    console.log("AccomodationModal")

    const formRef = useRef();
    const modalRef = useRef();
    const [ids, setIds] = useState(false)
    const editData = useSelector(state => {
        if (ids) {
            return state.trips.trips[ids.tripId].accomodations[ids.accomodationId]
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
            edit(tripId, accomodationId) {
                formRef.current.reset()
                setIds({
                    tripId,
                    accomodationId
                })
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef}>
            <Form ref={formRef} method='post' onSubmit={() => modalRef.current.close()}>
                <input name='accomodationId' className="sr-only" id='accomodationId' defaultValue={ids ? ids.accomodationId : undefined} readOnly></input>
                <span className={classes.formGroup}>
                    <label htmlFor='name'>Name</label>
                    <input name='name' id='name' defaultValue={ids ? editData?.name : ""} required></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='street'>Street</label>
                    <input name='street' id='street' defaultValue={ids ? editData?.street : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='city'>City</label>
                    <input name='city' id='city' defaultValue={ids ? editData?.city : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='state'>State/Province</label>
                    <input name='state' id='state' defaultValue={ids ? editData?.state : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='zip'>Zip Code</label>
                    <input name='zip' id='zip' defaultValue={ids ? editData?.zip : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='notes'>Notes</label>
                    <textarea rows="5" name='notes' id='notes' defaultValue={ids ? editData?.notes : ""}></textarea>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={ids ? edit : save} type='submit' name='purpose' value="updateAccomodation">{ids ? "Edit" : "Save"}</Button>
                </span>
            </Form>
        </Modal>
    );
}

export default AccomodationModal;