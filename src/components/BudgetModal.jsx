import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { save } from '../ui/Button';

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
                <label htmlFor='budget' className='sr-only'>Budget</label>
                <input name='budget' id='budget' type='number' defaultValue={defaultValue}></input>
                <Button icon={save} type='submit' name='purpose' value="editBudget">Save</Button>
            </Form>
        </Modal>
    );
}

export default BudgetModal;
