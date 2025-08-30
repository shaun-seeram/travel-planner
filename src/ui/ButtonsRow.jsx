import React from 'react';
import classes from "./ButtonsRow.module.css"

const ButtonsRow = ({children}) => {

    console.log("UI: ButtonsRow")

    return (
        <div className={classes.buttonsRow}>
            {children}
        </div>
    );
}

export default ButtonsRow;
