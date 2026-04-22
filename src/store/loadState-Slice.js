import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const loadStateSlice = createSlice({
  name: 'sideBar',
  initialState: {
      loadState:0
  },
  reducers: {
    alterLoadStatelHandler(state,action) {
        state.loadState = Math.random();
        console.log(state.loadState)
    }
  },
});

export const loadStateActions = loadStateSlice.actions;

export default loadStateSlice;