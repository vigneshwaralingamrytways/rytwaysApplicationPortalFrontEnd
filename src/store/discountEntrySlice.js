import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const discountEntrySlice = createSlice({
  name: 'discountState',
  initialState: {
      
      discountEntry:0,
   
  },
  reducers: {
    alterOrderEntrylHandler(state,action) {
      state.discountEntry = Math.random();
  },

  },
});

export const discountEntryActions = discountEntrySlice.actions;

export default discountEntrySlice;

