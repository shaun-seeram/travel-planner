import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';

const ExpenseModal = ({ref}) => {

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
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <label htmlFor='expenseName'>Expense Name</label>
                <input name='expenseName' id='expenseName'></input>
                <label htmlFor='expenseCost'>Expense Cost</label>
                <input name='expenseCost' id='expenseCost'></input>
                <Button icon={save} type='submit' name='purpose' value="addExpense">Save</Button>
            </Form>
        </Modal>
    );
}

export default ExpenseModal;
