import React, { useImperativeHandle, useRef, useState } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { edit, save } from '../ui/Button';
import { useSelector } from 'react-redux';
import classes from "../ui/Modal.module.css"

const ExpenseModal = ({ref}) => {

    console.log("ExpenseModal")

    const modalRef = useRef();
    const formRef = useRef();
    const [ids, setIds] = useState({init: false})
    const editData = useSelector(state => {
        if (ids.init) {
            return state.auth.trips[ids.tripId].budget.expenses[ids.expenseId]
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
            edit(tripId, expenseId) {
                formRef.current.reset()
                setIds({
                    init: true,
                    tripId,
                    expenseId
                })
                modalRef.current.open()
            }
        }
    })

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name='expenseId' className="sr-only" id='expenseId' defaultValue={ids.init ? ids.expenseId : ""}></input>
                <span className={classes.formGroup}>
                    <label htmlFor='expenseName'>Expense Name</label>
                    <input name='expenseName' id='expenseName' defaultValue={ids.init ? editData?.name : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor='expenseCost'>Expense Cost</label>
                    <input name='expenseCost' id='expenseCost' defaultValue={ids.init ? editData?.cost : ""}></input>
                </span>
                <span className={classes.buttonsContainer}>
                    {ids.init ? <Button icon={edit} type='submit' name='purpose' value="editExpense">Edit</Button> : <Button icon={save} type='submit' name='purpose' value="addExpense">Save</Button>}
                </span>
            </Form>
        </Modal>
    );
}

export default ExpenseModal;
