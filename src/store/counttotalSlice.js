import React from 'react'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total: 150,
}

const counttotalSlice = createSlice({
  name: 'counttotal',
  initialState,
  reducers: {
    totalHandler:(state,action) => {
        state.total += action.payload
    },
  },
});

export const {totalHandler} = counttotalSlice.actions
  export default counttotalSlice.reducer