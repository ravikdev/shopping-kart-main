import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { order_api } from "../api";

const initialState = {
    orderedProducts: [],
    orderCreatedMsg: "",
    orderCreated: false,
    ordersLoaded: false,
    status: "",
    error: ""
}

export const getOrders = createAsyncThunk(
    "orders/get",
    async (items, {rejectWithValue}) => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(`${order_api}/get-orders`, 
        items, {
            headers: {
                authorization: `${accessToken}`,
            }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const createOrders = createAsyncThunk(
    "orders/post",
    async (items, {rejectWithValue}) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(`${order_api}/create-order`, 
            items, {
                headers: {
                    authorization: `${accessToken}`,
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearOrder(state, action){
            // localStorage.clear();
            return {
                orderedProducts: [],
                orderCreatedMsg: "",
                orderCreated: false,
                ordersLoaded: false,
                status: "",
                error: ""
            }
        }
    },
    extraReducers: (builder) => {
        builder
    // getOrders
            .addCase(getOrders.pending, (state, action)=>{
                return {
                    ...state,
                    status: 'loading'
                }
            })
            .addCase(getOrders.fulfilled, (state, action)=>{
                state.status = "succeded";
                state.orderedProducts = action.payload;
                state.ordersLoaded = true;
            })
            .addCase(getOrders.rejected, (state, action)=>{
                return {
                    ...state,
                    status: 'rejected',
                    ordersLoaded: false,
                    error: action.error.message
                }
            })
    // createOrders
            .addCase(createOrders.pending, (state, action)=>{
                return {
                    ...state,
                    status: 'loading'
                }
            })
            .addCase(createOrders.fulfilled, (state, action)=>{
                state.status = "succeded";
                state.orderCreatedMsg = action.payload;
                state.orderCreated = true;
            })
            .addCase(createOrders.rejected, (state, action)=>{
                return {
                    ...state,
                    status: 'loading',
                    orderCreated: false,
                    error: action.error.message
                }
            })
    }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
