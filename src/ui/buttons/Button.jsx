import classes from "./Button.module.css"

const Button = ({icon, children, className, ...props}) => {

    console.log("UI: Button")

    const classesList = classes.button + (className ? ` ${className}` : "")

    return (
        <button {...props} className={classesList}>{icon} {children}</button>
    );
}

export default Button;