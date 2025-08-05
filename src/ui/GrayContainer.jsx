import React from 'react';
import classes from "./GrayContainer.module.css"

const GrayContainer = ({innerClasses = "", children}) => {

    const classNames = `${classes.container} ${innerClasses}`

    return (
        <div className={classNames}>
            {children}
        </div>
    );
}

export default GrayContainer;
