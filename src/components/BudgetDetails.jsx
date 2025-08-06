import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import BudgetModal from './BudgetModal';
import ExpenseModal from "./ExpenseModal"
import classes from "./BudgetDetails.module.css"
import ButtonsRow from "../ui/ButtonsRow"
import Button, { add, edit } from '../ui/Button';

const BudgetDetails = ({ trip }) => {

    const expenseRef = useRef()
    const budgetRef = useRef()

    const totalExpenses = Object.keys(trip.budget?.expenses).reduce((pT, cT) => pT + trip.budget.expenses[cT].cost, 0)
    const rightContent = `${trip.budget.expenses ? "$" + totalExpenses : "$" + 0} / ${"$" + trip.budget.budget}`

    return (
        <>
            <ExpenseModal ref={expenseRef} />
            <BudgetModal defaultValue={trip.budget.budget} ref={budgetRef} />

            <DetailsContainer title="Budget" rightContent={rightContent}>
                <GrayContainer innerClasses={classes.grayContainer}>
                    <p className={classes.expenses}>${trip.budget.expenses ? totalExpenses : 0}</p>
                    <progress value={trip.budget.expenses ? totalExpenses : 0} max={trip.budget.budget}></progress>
                    <p className={classes.budget}>Budget: ${trip.budget.budget}</p>
                    <ButtonsRow>
                        <Button icon={add} fn={() => expenseRef.current.open()}>Add Expense</Button>
                        <Button icon={edit} fn={() => budgetRef.current.open()}>Edit Budget</Button>
                    </ButtonsRow>
                </GrayContainer>
                <ul>
                    {Object.keys(trip.budget.expenses).map(key => {
                        const expense = trip.budget.expenses[key]
                        return <li>{expense.name}, {expense.cost}</li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default BudgetDetails;
