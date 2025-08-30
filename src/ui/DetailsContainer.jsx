import React from 'react';
import classes from "./DetailsContainer.module.css"

const DetailsContainer = ({title, rightContent, showOnOpen = false, children}) => {

    console.log("UI: DetailsContainer")

    return (
        <details className={classes.detailsContainer} open>
            <summary>
                {title}
                { 
                    rightContent && <div className={showOnOpen ? classes.summaryRightOpen : classes.summaryRight}>
                        {rightContent}
                    </div>
                }
            </summary>
            {children}
        </details>
    );
}

export default DetailsContainer;
