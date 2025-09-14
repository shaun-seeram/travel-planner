import { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"
import { useSelector } from 'react-redux';
import Modal from '../ui/Modal';
import Button from '../ui/buttons/Button';
import { save } from '../ui/buttons/buttonIcons';
import DeleteButton from "../ui/buttons/DeleteButton"
import classes from "../ui/Modal.module.css"

const EditModal = ({id, ref: editRef}) => {

    console.log("EditModal")

    const city = useSelector(state => state.trips.trips[id].city)
    const country = useSelector(state => state.trips.trips[id].country)
    const from = useSelector(state => state.trips.trips[id].from)
    const to = useSelector(state => state.trips.trips[id].to)

    const modalRef = useRef();
    const formRef = useRef();

    useImperativeHandle(editRef, () => {
        return {
            open() {
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <span className={classes.formGroup}>
                    <label htmlFor='city'>City</label>
                    <input name='city' id='city' defaultValue={city}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='country'>Country</label>
                    <input name='country' id='country' defaultValue={country}></input>
                </span>
                <p className={classes.warning}>Changes to the dates will result in the reset of the itenerary module.</p>
                <span className={classes.formGroup}>
                    <label htmlFor='tripFrom'>From</label>
                    <input name='from' id='tripFrom' type='date' defaultValue={from}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='tripTo'>To</label>
                    <input name='to' id='tripTo' type='date' defaultValue={to}></input>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={save} type='submit' name='purpose' value="updateTrip">Save</Button>
                    <DeleteButton id={id}>Delete Trip</DeleteButton>
                </span>
            </Form>
        </Modal>
    );
}

export default EditModal;