import { configureStore } from "@reduxjs/toolkit";
import moduleSlice from "./module-slice";
import modalSlice from "./modal-Slice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import alertSlice from "./alert-slice";
import loadStateSlice from "./loadState-Slice";
import orderEntrySlice from "./loadStates/orderEntry-slice";
import productionEntrySlice from "./loadStates/productionEntry-slice";
import counttotalReducer from "./counttotalSlice"
import apiBaseReducer from "./apiBaseSlice";
import filterSlice from "./filter-slice";
 

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, moduleSlice.reducer);
const apiBasePersistedReducer = persistReducer(persistConfig, apiBaseReducer); // ?? persist apiBase

export const store = configureStore({
  reducer: {
    sideBar: persistedReducer,
    filter:filterSlice.reducer,
    modalProps: modalSlice.reducer,
    alertProps: alertSlice.reducer,
    loadStateProps: loadStateSlice.reducer,
    orderEntryProps:orderEntrySlice.reducer,
    productionEntryProps:productionEntrySlice.reducer,
    counttotal:counttotalReducer,
    apiBase: apiBasePersistedReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistedstore = persistStore(store);
