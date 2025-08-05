import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"

const ExpenseModal = ({ref}) => {

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
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <label htmlFor='expenseName'>Expense Name</label>
                <input name='expenseName' id='expenseName'></input>
                <label htmlFor='expenseCost'>Expense Cost</label>
                <input name='expenseCost' id='expenseCost'></input>
                <button type='submit' name='purpose' value="addExpense">Save</button>
            </Form>
            <button onClick={closeForm}>x</button>
        </dialog>
    );
}

export default ExpenseModal;
