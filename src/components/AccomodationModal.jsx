import React, { useImperativeHandle, useRef, useState } from 'react';
import {Form} from "react-router-dom"
import Modal from '../ui/Modal';
import Button, { edit, save } from '../ui/Button';
import { useSelector } from 'react-redux';

const AccomodationModal = ({ref}) => {

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
                <input name='accomodationId' className="sr-only" id='accomodationId' defaultValue={ids.init ? ids.accomodationId : ""}></input>
                <label htmlFor='name'>Name</label>
                <input name='name' id='name' defaultValue={ids.init ? editData.name : ""}></input>
                <label htmlFor='address'>Address</label>
                <textarea name='address' id='address' rows="4" defaultValue={ids.init ? editData.address : ""}></textarea>
                {ids.init ? <Button icon={edit} type='submit' name='purpose' value="editAccomodation">Edit</Button> : <Button icon={save} type='submit' name='purpose' value="addAccomodation">Save</Button>}
            </Form>
        </Modal>
    );
}

export default AccomodationModal;