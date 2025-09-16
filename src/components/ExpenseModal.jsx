import { useImperativeHandle, useRef, useState } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button from '../ui/buttons/Button';
import { edit, save } from '../ui/buttons/buttonIcons';
import { useSelector } from 'react-redux';
import classes from "../ui/Modal.module.css"

const ExpenseModal = ({ref}) => {

    console.log("ExpenseModal")

    const modalRef = useRef();
    const formRef = useRef();
    const [ids, setIds] = useState(false)
    const editData = useSelector(state => {
        if (ids) {
            return state.trips.trips[ids.tripId].budget.expenses[ids.expenseId]
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
            edit(tripId, expenseId) {
                formRef.current.reset()
                setIds({
                    tripId,
                    expenseId
                })
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name='expenseId' className="sr-only" id='expenseId' defaultValue={ids ? ids.expenseId : undefined} readOnly></input>
                <span className={classes.formGroup}>
                    <label htmlFor='expenseName'>Expense Name</label>
                    <input name='name' id='expenseName' defaultValue={ids ? editData?.name : ""} required></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='expenseCost'>Expense Cost</label>
                    <input name='cost' type="number" id='expenseCost' defaultValue={ids ? editData?.cost : ""} required></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='expenseNotes'>Notes</label>
                    <textarea rows="5" name='notes' id='expenseNotes' defaultValue={ids ? editData?.notes : ""}></textarea>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={ids ? edit : save} type='submit' name='purpose' value="updateExpenses">{ids ? "Edit" : "Save"}</Button>
                </span>
            </Form>
        </Modal>
    );
}

export default ExpenseModal;
