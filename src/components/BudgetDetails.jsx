import React, { useRef } from 'react';
import DetailsContainer from '../ui/DetailsContainer';
import GrayContainer from '../ui/GrayContainer';
import BudgetModal from './BudgetModal';
import ExpenseModal from "./ExpenseModal"
import classes from "./BudgetDetails.module.css"
import ButtonsRow from "../ui/ButtonsRow"
import Button from '../ui/buttons/Button';
import { add, edit, trash } from '../ui/buttons/buttonIcons';
import RoundButton from "../ui/buttons/RoundButton";
import { useDispatch, useSelector } from 'react-redux';
import { fbDelete } from '../firebase/authentication';
import { authActions } from '../store';

const BudgetDetails = ({id}) => {

    console.log("BudgetDetails")

    const budget = useSelector(state => state.auth.trips[id].budget)
    const dispatch = useDispatch()

    const expenseRef = useRef()
    const budgetRef = useRef()
    
    const totalExpenses = budget.expenses && Object.keys(budget.expenses).reduce((pT, cT) => pT + budget.expenses[cT].cost, 0)
    const rightContent = `${budget.expenses ? "$" + totalExpenses : "$" + 0} / ${"$" + budget.budget}`

    const deleteExpense = (expenseId) => {
        fbDelete("/trips/" + id + "/budget/expenses/" + expenseId)
        dispatch(authActions.deleteExpense({
            tripId: id,
            expenseId
        }))
    }

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
                        <Button icon={add} onClick={() => expenseRef.current.open()}>Add Expense</Button>
                        <Button icon={edit} onClick={() => budgetRef.current.open()}>Edit Budget</Button>
                    </ButtonsRow>
                </GrayContainer>
                <ul>
                    {budget.expenses && Object.keys(budget.expenses).map(key => {
                        return <li className={classes.listItem} key={key}>
                            <div className={classes.upperRow}>
                                <span>{budget.expenses[key].name}</span>
                                <span className={classes.value}>
                                    ${budget.expenses[key].cost}
                                    <RoundButton icon={edit} onClick={() => expenseRef.current.edit(id, key)} />
                                    <RoundButton icon={trash} onClick={() => deleteExpense(key)} />
                                </span>
                            </div>
                            {budget.expenses[key].notes &&
                                <div className={classes.lowerRow}>
                                    <pre>{budget.expenses[key].notes}</pre>
                                </div>
                            }
                        </li>
                    })}
                </ul>
            </DetailsContainer>
        </>
    );
}

export default BudgetDetails;
