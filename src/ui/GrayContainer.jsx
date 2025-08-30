import React from 'react';
import classes from "./GrayContainer.module.css"

const GrayContainer = ({innerClasses = "", children}) => {

    console.log("UI: GrayContainer")

    const classNames = `${classes.container} ${innerClasses}`

    return (
        <div className={classNames}>
            {children}
        </div>
    );
}

export default GrayContainer;
