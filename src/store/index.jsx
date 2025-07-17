import {configureStore, createSlice} from "@reduxjs/toolkit";
import {Provider} from "react-redux"

const authSlice = createSlice({
    name: "authentication",
    initialState: {
        uid: null
    },
    reducers: {
        login(state, action) {
            state.uid = action.payload
        },
        logout(state) {
            state.uid = null
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
