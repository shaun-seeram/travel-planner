import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider } from "react-redux"
import { db } from "../firebase/authentication";
import { child, get, ref } from "firebase/database";
import { plannerMapping } from "../util";

const authSlice = createSlice({
    name: "authentication",
    initialState: {
        sessionReady: false,
        uid: null,
        currentPage: null
    },
    reducers: {
        login(state, action) {
            state.sessionReady = true
            state.uid = action.payload.uid
        },
        logout(state) {
            state.sessionReady = true
            state.uid = null
            state.currentPage = null
        },
        changePage(state, action) { state.currentPage = action.payload },
    }
})

const tripSlice = createSlice({
    name: "tripData",
    initialState: {
        trips: {},
    },
    reducers: {
        login(state, action) {
            state.trips = action.payload.trips || {}
        },
        logout(state) {
            state.trips = {}
        },
        addTrip(state, action) { state.trips[action.payload.tripId] = action.payload.trip },
        updateTrip(state, action) { state.trips[action.payload.tripId] = {...state.trips[action.payload.tripId], ...action.payload.trip} },
        removeTrip(state, action) { delete state.trips[action.payload] },
        saveNotes(state, action) { state.trips[action.payload.tripId].notes = action.payload.notes },
        editBudget(state, action) { state.trips[action.payload.tripId].budget.budget = action.payload.budget },
        updateExpense(state, action) {
            if (!state.trips[action.payload.tripId].budget.expenses) {
                state.trips[action.payload.tripId].budget.expenses = {}
            }

            state.trips[action.payload.tripId].budget.expenses[action.payload.expenseId] = action.payload.expense
        },
        deleteExpense(state, action) { delete state.trips[action.payload.tripId].budget.expenses[action.payload.expenseId] },
        updateFlight(state, action) {
            if (!state.trips[action.payload.tripId].flights) {
                state.trips[action.payload.tripId].flights = {}
            }

            state.trips[action.payload.tripId].flights[action.payload.flightId] = action.payload.flight

        },
        deleteFlight(state, action) { delete state.trips[action.payload.tripId].flights[action.payload.flightId] },
        updateAccomodation(state, action) {
            if (!state.trips[action.payload.tripId].accomodations) {
                state.trips[action.payload.tripId].accomodations = {}
            }

            state.trips[action.payload.tripId].accomodations[action.payload.accomodationId] = action.payload.accomodation

        },
        deleteAccomodation(state, action) { delete state.trips[action.payload.tripId].accomodations[action.payload.accomodationId] },
        updatePlanner(state, action) {
            if (!state.trips[action.payload.tripId].planner[action.payload.plannerDate].plans) {
                state.trips[action.payload.tripId].planner[action.payload.plannerDate].plans = {}
            }
            state.trips[action.payload.tripId].planner[action.payload.plannerDate].plans[action.payload.plannerId] = action.payload.planner
        },
        deletePlan(state, action) { delete state.trips[action.payload.tripId].planner[action.payload.dateId].plans[action.payload.plannerId] },
        resetPlanner(state, action) { state.trips[action.payload.tripId].planner = plannerMapping(action.payload.from, action.payload.to) }
    }
})

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        trips: tripSlice.reducer
    }
})

const StoreProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}

export const authActions = authSlice.actions
export const tripActions = tripSlice.actions
export default StoreProvider;

export const asyncLogin = (uid) => {
    return async (dispatch) => {
        const tripsSnapshot = await get(child(ref(db), uid + "/trips/"))
        dispatch(authActions.login({
            uid,
        }))
        dispatch(tripActions.login({
            trips: tripsSnapshot.val()
        }))
    }
}