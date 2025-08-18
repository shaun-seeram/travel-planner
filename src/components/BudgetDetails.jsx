import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import BudgetModal from './BudgetModal';
import ExpenseModal from "./ExpenseModal"
import classes from "./BudgetDetails.module.css"
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add, edit } from '../ui/Button';
import { useSelector } from 'react-redux';

const BudgetDetails = ({id}) => {

    const budget = useSelector(state => state.auth.trips[id].budget)

    const expenseRef = useRef()
    const budgetRef = useRef()
    
    const totalExpenses = budget.expenses && Object.keys(budget.expenses).reduce((pT, cT) => pT + budget.expenses[cT].cost, 0)
    const rightContent = `${budget.expenses ? "$" + totalExpenses : "$" + 0} / ${"$" + budget.budget}`

    return (
        <>
            <ExpenseModal ref={expenseRef} />
            <BudgetModal defaultValue={budget.budget} ref={budgetRef} />

            <DetailsContainer title="Budget" rightContent={rightContent}>
                <GrayContainer innerClasses={classes.grayContainer}>
                    <p className={classes.expenses}>${budget.expenses ? totalExpenses : 0}</p>
                    <progress value={budget.expenses ? totalExpenses : 0} max={budget.budget}></progress>
                    <p className={classes.budget}>Budget: ${budget.budget}</p>
                    <ButtonsRow>
                        <Button icon={add} fn={() => expenseRef.current.open()}>Add Expense</Button>
                        <Button icon={edit} fn={() => budgetRef.current.open()}>Edit Budget</Button>
                    </ButtonsRow>
                </GrayContainer>
                <ul>
                    {budget.expenses && Object.keys(budget.expenses).map(key => {
                        return <li key={key}>{budget.expenses[key].name}, {budget.expenses[key].cost}</li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default BudgetDetails;
