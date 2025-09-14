import classes from "./RoundButton.module.css"

const RoundButton = ({icon, ...props}) => {

    console.log("UI: RoundButton")

    return (
        <button {...props} className={classes.button}>{icon}</button>
    );
}

export default RoundButton;