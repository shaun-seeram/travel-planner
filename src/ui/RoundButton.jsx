import classes from "./RoundButton.module.css"

const Button = ({icon, handleClick = () => {}, ...props}) => {

    console.log("UI: RoundButton")

    return (
        <button {...props} className={classes.button} onClick={handleClick}>{icon}</button>
    );
}

export default Button;