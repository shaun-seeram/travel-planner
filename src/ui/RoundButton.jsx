import classes from "./RoundButton.module.css"

const RoundButton = ({icon, handleClick = () => {}, ...props}) => {

    console.log("UI: RoundButton")

    return (
        <button {...props} className={classes.button} onClick={handleClick}>{icon}</button>
    );
}

export default RoundButton;