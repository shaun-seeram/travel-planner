import React, { useImperativeHandle, useRef, useState } from "react";
import { Form } from "react-router-dom";
import Modal from "../ui/Modal";
import Button, { edit, save } from "../ui/Button";
import { fbDelete } from "../firebase/authentication";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";
import classes from "../ui/Modal.module.css";
import DeleteButton from "../ui/DeleteButton";

const PlannerModal = ({ ref }) => {
    console.log("PlannerModal");

    const formRef = useRef();
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [ids, setIds] = useState({ init: false, plannerDate: "" });
    const editData = useSelector((state) => {
        if (ids.init) {
            return state.auth.trips[ids.tripId].planner[ids.plannerDate].plans[ids.plannerId];
        } else {
            return null;
        }
    });

    useImperativeHandle(ref, () => {
        return {
            open(plannerDate) {
                formRef.current.reset();
                setIds({ 
                    init: false,
                    plannerDate
                 });
                modalRef.current.open();
            },
            edit(tripId, plannerDate, plannerId) {
                formRef.current.reset();
                setIds({
                    init: true,
                    tripId,
                    plannerDate,
                    plannerId,
                });
                modalRef.current.open();
            },
        };
    });

    const deletePlan = () => {
        fbDelete("/trips/" + ids.tripId + "/planner/" + ids.plannerDate + "/plans/" + ids.plannerId);
        dispatch(
            authActions.deletePlan({
                tripId: ids.tripId,
                dateId: ids.plannerDate,
                plannerId: ids.plannerId,
            })
        );
    };

    return (
        <Modal ref={modalRef} formRef={formRef}>
            <Form method="post" ref={formRef} onSubmit={() => modalRef.current.close()}>
                <input name="plannerDate" className="sr-only" defaultValue={ids.plannerDate} readOnly></input>
                { ids.init && <input name="plannerId" className="sr-only" value={ids.plannerId} readOnly></input> }
                <span className={classes.formGroup}>
                    <label htmlFor="place">Place</label>
                    <input name="place" id="place" defaultValue={ids.init ? editData?.place : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input name="address" id="address" defaultValue={ids.init ? editData?.address : ""}></input>
                </span>
                <span className={classes.formGroup}>
                    <label htmlFor="notes">Notes</label>
                    <textarea name="notes" id="notes" defaultValue={ids.init ? editData?.notes : ""}></textarea>
                </span>
                <span className={classes.buttonsContainer}>
                    <Button icon={ids.init ? edit : save} type="submit" name="purpose" value="updatePlanner">{ids.init ? "Edit" : "Save"}</Button>
                    { ids.init && <DeleteButton fn={deletePlan} name="delete">Delete</DeleteButton> }
                </span>
            </Form>
        </Modal>
    );
};

export default PlannerModal;
