import { deleteUser } from 'firebase/auth';
import auth, { fbDelete, fbUpdate } from "../firebase/authentication"
import { useDispatch, useSelector } from "react-redux"
import { authActions, tripActions } from '../store';
import { useNavigate } from "react-router-dom"
import Button from '../ui/buttons/Button';
import { save, trash } from '../ui/buttons/buttonIcons';
import classes from "./Settings.module.css"
import { useRef } from 'react';
import ButtonsRow from "../ui/ButtonsRow"
import GrayContainer from "../ui/GrayContainer"
import DeleteButton from '../ui/buttons/DeleteButton';

const Settings = () => {

    console.log("Page: Settings")

    const name = useSelector(state => state.auth.name)
    const nameRef = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const deleteAllData = () => {
        fbDelete("/trips/")
        dispatch(tripActions.logout())
    }

    const deleteUserAccount = () => {
        fbDelete()
        dispatch(tripActions.logout())
        deleteUser(auth.currentUser)
        return navigate("/")
    }

    const handleSave = async () => {
        await fbUpdate("/", { name: nameRef.current.value })
        dispatch(authActions.changeName(nameRef.current.value))
    }

    return (
        <div>
            <span className={classes.formGroup}>
                <label htmlFor='name'>First Name</label>
                <input ref={nameRef} type='text' name="name" id='name' defaultValue={name}></input>
            </span>
            <span className={classes.buttonsContainer}>
                <Button icon={save} onClick={handleSave}>Save</Button>
            </span>
            <GrayContainer>
                <p className={classes.warning}>Delete all your data or your account. This action is irreversible.</p>
                <ButtonsRow>
                    <DeleteButton onClick={deleteAllData}>Delete All Data</DeleteButton>
                    <DeleteButton onClick={deleteUserAccount}>Delete Account</DeleteButton>
                </ButtonsRow>
            </GrayContainer>
        </div>
    );
}

export default Settings;
