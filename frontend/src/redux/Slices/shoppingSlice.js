import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { cart_api } from "../api";
import axios from "axios";

const initialState = {
  products: [],
  error: null,
  addCartStatus: "",
  status: 'idle',
};

export const getToCart = createAsyncThunk(
  "cart/getItemsTocart",
  async (items, {rejectWithValue}) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(`${cart_api}/get-cart`, 
      items, {
        headers: {
          authorization: `${accessToken}`,
        }
      });
      // console.log("🚀 ~ file: shoppingSlice.js:19 ~ response:", response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addtocart",
  async (items, {rejectWithValue}) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(`${cart_api}/add-cart`, 
        items, {
          headers: {
            authorization: token,
          }
        }
      );
      return response.data.message;
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem', 
  async (value, {rejectWithValue}) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(`${cart_api}/update-cart`, 
      value, {
        headers: {
          'authorization': token,
        }
      });
      return response.data.message;
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
});

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem', 
  async (value, {rejectWithValue}) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`${cart_api}/delete-cart`, {
        data : value,
        headers: {
          'authorization': token,
        }
      });
      return response.data.message;
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
});

export const shoppingSlice = createSlice({
  name: "Shopping",
  initialState,
  reducers: {
    logoutUserShopping(state, action){
      localStorage.clear();
      return {
        products: [],
        error: null,
        status: 'idle',
      }
    },
    getItemsCart(state, action){
      const item = state.products.push(
        (item) => item
      )
    },
    clearCartItem(state, action){
      // localStorage.clear();
      state.products = [];
      state.error = null;
      state.status = 'idle';
    }
    // addToCart: (state, action) => {
    //   const item = state.products.find(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (item) {
    //     item.quantity += action.payload.quantity;
    //   } else {
    //     state.products.push(action.payload);
    //   }
    // },
    // increaseQuantity: (state, action) => {
    //   const item = state.products.find(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (item) {
    //     item.quantity++;
    //   }
    // },
    // drecreaseQuantity: (state, action) => {
    //   const item = state.products.find(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (item.quantity > 0) {
    //     item.quantity--;
    //     if(item.quantity===0){
    //       state.products = state.products.filter(item => item.quantity !== 0);
    //     }
    //   } else {
    //     state.products = state.products.filter(item => item.quantity !== 0);
    //     console.log(state.products)
    //   }
    // },
    // deleteItem: (state, action) => {
    //   state.products = state.products.filter(
    //     (item) => item._id !== action.payload
    //   );
    // },
    // resetCart: (state) => {
    //   state.products = [];
    // },
  },
  extraReducers: (builder) => {
    builder
    // getToCart
      .addCase(getToCart.pending, (state, action)=>{
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getToCart.fulfilled, (state, action)=>{
        state.status = "succeded";
        state.error = null;
        state.products = (action.payload);
      })
      .addCase(getToCart.rejected, (state, action)=>{
        state.status = 'failed';
        state.error = action.error.message;
      })

    // addToCart
      .addCase(addToCart.pending, (state, action)=>{
        state.addCartStatus = 'loading';
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action)=>{
        state.error = null;
        state.addCartStatus = "succeded";
      })
      .addCase(addToCart.rejected, (state, action)=>{
        state.addCartStatus = 'failed';
        state.error = action.error.message;
      })

    // updateCartItem
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // const index = state.cartItems.findIndex(item => item.id === action.payload.id);
        // if (index !== -1) {
        //   state.cartItems[index] = action.payload;
        // }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

    // deleteCartItem
      .addCase(deleteCartItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  // addToCart,
  // increaseQuantity,
  // drecreaseQuantity,
  deleteItem,
  resetCart,
  logoutUserShopping,
  clearCartItem
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
