import React from 'react';
import classes from "./DetailsContainer.module.css"

const DetailsContainer = ({title, rightContent, children}) => {
    return (
        <details className={classes.detailsContainer} open>
            <summary>
                {title}
                { 
                    rightContent && <div className={classes.summaryRight}>
                        {rightContent}
                    </div>
                }
            </summary>
            {children}
        </details>
    );
}

export default DetailsContainer;
