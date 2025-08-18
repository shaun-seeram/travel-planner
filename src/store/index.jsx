import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider } from "react-redux"
import { db } from "../firebase/authentication";
import { child, get, ref } from "firebase/database";

const authSlice = createSlice({
    name: "authentication",
    initialState: {
        sessionReady: false,
        uid: null,
        trips: {}
    },
    reducers: {
        login(state, action) {
            state.sessionReady = true
            state.uid = action.payload.id
            state.trips = action.payload.trips || {}
        },
        logout(state) {
            state.sessionReady = true
            state.uid = null
            state.trips = {}
        },
        addTrip(state, action) {
            state.trips[action.payload.id] = action.payload.trip
        },
        removeTrip(state, action) {
            delete state.trips[action.payload]
        },
        addAccomodation(state, action) {
            if (!state.trips[action.payload.tripId].accomodations) {
                state.trips[action.payload.tripId].accomodations = {}
            }

            state.trips[action.payload.tripId].accomodations[action.payload.accomodationId] = action.payload.accomodation

        },
        addFlight(state, action) {
            if (!state.trips[action.payload.tripId].flights) {
                state.trips[action.payload.tripId].flights = {}
            }

            state.trips[action.payload.tripId].flights[action.payload.flightId] = action.payload.flight

        },
        deleteFlight(state, action) {
            delete state.trips[action.payload.tripId].flights[action.payload.flightId]
        },
        editBudget(state, action) { state.trips[action.payload.tripId].budget.budget = action.payload.budget },
        addExpense(state, action) {
            if (!state.trips[action.payload.tripId].budget.expenses) {
                state.trips[action.payload.tripId].budget.expenses = {}
            }

            state.trips[action.payload.tripId].budget.expenses[action.payload.expenseId] = action.payload.expense
        },
        deleteExpense(state, action) {
            delete state.trips[action.payload.tripId].budget.expenses[action.payload.expenseId]
        },
        editTrip(state, action) {
            state.trips[action.payload.tripId].city = action.payload.city;
            state.trips[action.payload.tripId].country = action.payload.country;
            state.trips[action.payload.tripId].from = action.payload.from;
            state.trips[action.payload.tripId].to = action.payload.to;
            state.trips[action.payload.tripId].currency = action.payload.currency;
            state.trips[action.payload.tripId].latitude = action.payload.latitude;
            state.trips[action.payload.tripId].longitude = action.payload.longitude;
        },
        addPlanner(state, action) {
            if (!state.trips[action.payload.tripId].planner[action.payload.plannerId].plans) {
                state.trips[action.payload.tripId].planner[action.payload.plannerId].plans = {}
            }
            state.trips[action.payload.tripId].planner[action.payload.plannerId].plans[action.payload.eventId] = {
                place: action.payload.place,
                address: action.payload.address,
                notes: action.payload.notes,
                lat: action.payload.lat,
                lon: action.payload.lon
            }
        },
        editPlanner(state, action) {
            state.trips[action.payload.tripId].planner[action.payload.plannerDate].plans[action.payload.plannerId] = {
                place: action.payload.place,
                address: action.payload.address,
                notes: action.payload.notes,
                lat: action.payload.lat,
                lon: action.payload.lon
            }
        },
        resetPlanner(state, action) {
            const from = new Date(action.payload.from.split("-"))
            const to = new Date(action.payload.to.split("-"))
            const planner = {}
            const months = ["January", "February", "March", "April", "May", "June", 'July', "August", 'September', "October", "November", 'December']

            for (let i = from.getTime(); i <= (to.getTime()); i += 86400000) {
                const iteration = new Date(i)
                planner[i] = {
                    stringifiedDate: `${months[iteration.getMonth()]} ${iteration.getDate()}, ${iteration.getFullYear()}`
                }
            }
            state.trips[action.payload.tripId].planner = planner

        },
        deleteAllData(state) {
            state.trips = {}
        }
    }
})

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer
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
export default StoreProvider;

export const asyncLogin = (id) => {
    return async (dispatch) => {
        const tripsSnapshot = await get(child(ref(db), id + "/trips/"))
        dispatch(authActions.login({
            id,
            trips: tripsSnapshot.val()
        }))
    }
}