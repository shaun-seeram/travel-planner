import classes from "./DeleteButton.module.css"
import { fbDelete } from "../../firebase/authentication";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tripActions } from "../../store";
import { trash } from "./buttonIcons";

const DeleteButton = ({id, children, fn, ...props}) => {

    console.log("UI: DeleteButton")

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        fbDelete("/trips/" + id)
        dispatch(tripActions.removeTrip(id))
        return navigate("/trips/")
    }

    return (
        <button {...props} className={classes.deleteButton} onClick={fn || handleDelete}>{trash} {children}</button>
    );
}

export default DeleteButton;