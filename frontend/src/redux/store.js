import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import shoppingReducer from "./Slices/shoppingSlice";
import authSlice from "./Slices/authSlice";
import userSlice from "./Slices/userSlice";
import orderSlice from "./Slices/orderSlice";

const persistConfig = {
  key: "root",
  storage
};

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  shopping: shoppingReducer,
  orders: orderSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);