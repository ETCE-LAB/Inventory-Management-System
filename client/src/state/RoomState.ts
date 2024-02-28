import { notifications } from "@mantine/notifications";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { Keys } from "../Arch/keys";
import { BackendBaseUrl } from "../Arch/Urls";
import { Building } from "../Models/Building";
import { Room } from "../Models/Room";
import { User } from "../Models/User";
import { RootState } from "../Store";

export interface RoomState{
    rooms: Room[]
    status: 'idle' | 'loading' | 'failed'
}

const initialState : RoomState = {
    rooms: [],
    status: 'idle'
}

export const getRoomsAsync = createAsyncThunk(
    'getRoomsAsync',
    async () => {
        const getRoomsUrl = BackendBaseUrl + "/room/all"
        const data = await axios.get(
            getRoomsUrl,
            {
                headers: {
                    token: window.localStorage.getItem(Keys.Access_token)
                },
                withCredentials: true
            }
        )
        console.log(data)
        return {rooms: data.data.rooms}
    }
);

export const createRoomAsync = createAsyncThunk(
    'createRoomAsync',
    async ({name, floor, buildingId}:{name: string, floor: number, buildingId: string}) => {
        const createRoomAsyncUrl = BackendBaseUrl + "/room/create"
        const data = await axios.post(
            createRoomAsyncUrl,
            {
                name : name,
                floor : floor,
                buildingId: buildingId
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

export const deleteRoomAsync = createAsyncThunk(
    'deleteRoomAsync',
    async (roomId: string) => {
        const deleteRoomAsyncUrl = BackendBaseUrl + "/room/delete"
        const data = await axios.post(
            deleteRoomAsyncUrl,
            {
                roomId : roomId
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



export const roomsSlice = createSlice({
    name: 'roomsSlice',
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
            .addCase(createRoomAsync.pending, (state, action) => {
                console.log("createRoomAsync is loading")
            })
            .addCase(createRoomAsync.fulfilled, (state, action) => {
                console.log("createRoomAsync is fulfilled")
                console.log(action.payload)
                notifications.show({
                    title: action.payload.data.success ? "Success" : "Error",
                    message: action.payload.data.message,
                })
            })
            .addCase(createRoomAsync.rejected, (state, {error}) => {
                console.log("createRoomAsync is rejected")
            });

        //deleteRoomAsync
        builder
            .addCase(deleteRoomAsync.pending, (state, action) => {
                console.log("deleteRoomAsync is loading")
            })
            .addCase(deleteRoomAsync.fulfilled, (state, action) => {
                console.log("deleteRoomAsync is fulfilled")
                console.log(action.payload)
            })
            .addCase(deleteRoomAsync.rejected, (state, {error}) => {
                console.log("deleteRoomAsync is rejected")
            });
    },
});

export const {  } = roomsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRooms = (state: RootState) => state.rooms;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.


export default roomsSlice.reducer;