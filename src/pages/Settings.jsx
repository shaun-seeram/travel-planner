import { deleteUser } from 'firebase/auth';
import auth, {fbDelete} from "../firebase/authentication"
import {useDispatch} from "react-redux"
import { authActions } from '../store';
import {useNavigate} from "react-router-dom"
import Button from '../ui/buttons/Button';
import { trash } from '../ui/buttons/buttonIcons';

const Settings = () => {

    console.log("Page: Settings")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const deleteAllData = () => {
        fbDelete("/trips/")
        dispatch(authActions.deleteAllData())
    }

    const deleteUserAccount = () => {
        fbDelete()
        dispatch(authActions.deleteAllData())
        deleteUser(auth.currentUser)
        return navigate("/")
    }

    return (
        <div>
            <Button icon={trash} onClick={deleteAllData}>Delete All Data</Button>
            <Button icon={trash} onClick={deleteUserAccount}>Delete Account</Button>
        </div>
    );
}

export default Settings;
