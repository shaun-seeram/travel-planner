import {configureStore, createSlice} from "@reduxjs/toolkit";
import {Provider} from "react-redux"
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
        }
    }
})

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
})

const StoreProvider = ({children}) => {
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