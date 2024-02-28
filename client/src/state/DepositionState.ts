import { notifications } from "@mantine/notifications";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { Keys } from "../Arch/keys";
import { BackendBaseUrl } from "../Arch/Urls";
import { Building } from "../Models/Building";
import { User } from "../Models/User";
import { RootState } from "../Store";

export interface DepositionState{
    status: 'idle' | 'loading' | 'failed'
}

const initialState : DepositionState = {
    status: 'idle'
}


export const createDepositionAsync = createAsyncThunk(
    'createDepositionAsync',
    async ({itemId, shelfId}:{itemId: string, shelfId: string}) => {
        const createDepositionAsyncUrl = BackendBaseUrl + "/deposition/create"
        const data = await axios.post(
            createDepositionAsyncUrl,
            {
                itemId : itemId,
                shelfId : shelfId
            },
            {
                headers: {
                    token: window.localStorage.getItem(Keys.Access_token)
                },
                withCredentials: true
            }
        )
        console.log(data)
        return data
    }
);



export const depositionsSlice = createSlice({
    name: 'depositionsSlice',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        //getUsersAsync
        builder
            .addCase(createDepositionAsync.pending, (state, action) => {
                console.log("createDepositionAsync is loading")
            })
            .addCase(createDepositionAsync.fulfilled, (state, action) => {
                console.log("createDepositionAsync is fulfilled")
                notifications.show({
                    title: action.payload.data.success ? "Success" : "Error",
                    message: action.payload.data.message,
                    color: action.payload.data.success ? "" : 'red',
                })
            })
            .addCase(createDepositionAsync.rejected, (state, {error}) => {
                console.log("createDepositionAsync is rejected")
            });
    },
});

export const {  } = depositionsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectDepositions = (state: RootState) => state.depositions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.


export default depositionsSlice.reducer;