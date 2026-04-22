import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const productionEntrySlice = createSlice({
  name: 'productionState',
  initialState: {
      entrySearch:0,
      productionEntry:0,
      processEntry:0,
      dispatch:0,
      meltingEntry:0,
      addRawMaterials:0,
      castingEntry:0
  },
  reducers: {
    alterEntrySearchHandler(state,action) {
      state.entrySearch = Math.random();
      console.log(state.entrySearch)
    },
    alterProductionEntryHandler(state,action) {
      state.productionEntry = Math.random();
  },
  alterprocessEntryHandler(state,action) {
    state.processEntry = Math.random();
  },
  alterDispatchHandler(state,action) {
    state.dispatch = Math.random();
  },
  alterMeltingEntryHandler(state,action) {
    state.meltingEntry = Math.random();
  },
  alterAddRawMaterialsHandler(state,action) {
    state.addRawMaterials = Math.random();
  },
  alterCastingEntryHandler(state,action) {
    state.castingEntry = Math.random();
    console.log(state.castingEntry)
  },
  },
});

export const productionEntryActions = productionEntrySlice.actions;

export default productionEntrySlice;