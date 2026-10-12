import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { auth_api } from "../api";

const initialState = {
    accessToken: "",
    refreshToken: "",
    _id: "",
    registerStatus: "",
    registerError: "",
    loginStatus: "",
    loginError: "",
    userLoaded: false,
    genToken: false
}

export const generateToken = createAsyncThunk(
    "auth/generateToken",
    async (values, {rejectWithValue}) => {
        try {
            if (values){
                setInterval( async () => {
                    const response = await axios.post(
                        `${auth_api}/generate-token`, {
                            "refreshToken" : values
                        }
                    );
                    localStorage.setItem("accessToken", response.data.accessToken);

                    return response.data;
                }, 1800000);
            }
        } catch (err) {
            console.log(err.response.data);
            return rejectWithValue(err.response.data);
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (values, {rejectWithValue}) => {
        try {
            const response = await axios.post(
                `${auth_api}/signup`,
                {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password
                }
            );
            return response.data.msg
        } catch(err) {
            console.log(err.response.data)
            return rejectWithValue(err.response.data);
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (values, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${auth_api}/login`,{
                email: values.email,
                password: values.password
            });

            localStorage.setItem("accessToken", response.data.accessToken);
            return response.data
        } catch(err) {
            return rejectWithValue(err.response.data);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loadUser(state, action){
            const token = state.accessToken
            if(token) {
                return {
                    ...state,
                    accessToken: token,
                    userLoaded: true,
                }
            }
        },
        logoutUser(state, action){
            localStorage.clear();
            return {
                ...state,
                _id: "",
                accessToken: "",
                refreshToken: "",
                registerStatus: "",
                registerError: "",
                loginStatus: "",
                loginError: "",
                userLoaded: false
            }
        }
    },
    extraReducers: (builder) => {
    // register User
        builder
            .addCase(registerUser.pending, (state, action)=>{
                return {...state, 
                    loginStatus: "",
                    loginError: "",
                    registerStatus:"pending"
                }
            })
            .addCase(registerUser.fulfilled, (state, action)=>{
                return {...state,
                    loginStatus: "",
                    loginError: "", 
                    registerStatus: "success",
                    registerError: ""
                }
            })
            .addCase(registerUser.rejected, (state, action)=>{
                return{
                    ...state,
                    loginStatus: "",
                    loginError: "",
                    userLoaded: false,
                    registerStatus: "rejected",
                    registerError: action.payload
                }
            })

    // Login user
            .addCase(loginUser.pending, (state, action) => { 
                return {...state, loginStatus:"pending"} 
            })
            .addCase(loginUser.fulfilled, (state, action)=>{
                return { 
                    ...state,
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                    loginError: "",
                    loginStatus: "success",
                    userLoaded: true,
                }
            })
            .addCase(loginUser.rejected, (state, action)=>{
                return{
                    ...state,
                    userLoaded: false,
                    loginStatus: "rejected",
                    loginError: action.payload
                }
            })

    // generate token user
            .addCase(generateToken.pending, (state, action) => { return {...state , genToken: false } })
            .addCase(generateToken.fulfilled, (state, action)=>{
                if(action.payload){
                    return { 
                        ...state,
                        accessToken: action.payload.accessToken,
                        genToken: true
                    }
                }else return state
            })
                .addCase(generateToken.rejected, (state, action)=>{
                return{...state, genToken: false}
            });
    }
});

export const { loadUser, logoutUser } = authSlice.actions
export default authSlice.reducer;