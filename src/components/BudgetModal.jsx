import React, { useImperativeHandle, useRef } from 'react';
import {Form} from "react-router-dom"

const BudgetModal = ({defaultValue = 0, ref}) => {

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
                <label htmlFor='budget' className='sr-only'>Budget</label>
                <input name='budget' id='budget' type='number' defaultValue={defaultValue}></input>
                <button type='submit' name='purpose' value="editBudget">Save</button>
            </Form>
            <button onClick={closeForm}>x</button>
        </dialog>
    );
}

export default BudgetModal;
