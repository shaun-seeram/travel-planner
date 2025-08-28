import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';
import classes from "../ui/Modal.module.css"

const BudgetModal = ({defaultValue = 0, ref}) => {

    const formRef = useRef();
    const modalRef = useRef();

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
                <span className={classes.formGroup}>
                    <label htmlFor='budget'>Budget</label>
                    <input name='budget' id='budget' type='number' defaultValue={defaultValue}></input>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={save} type='submit' name='purpose' value="editBudget">Save</Button>
                </span>
            </Form>
        </Modal>
    );
}

export default BudgetModal;
