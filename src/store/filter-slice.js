import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    filters: [],
  },
  reducers: {
    setFilters(state, action) {
      const incoming = action.payload; // {id: ..., orderStatusId: ...}

      const index = state.filters.findIndex(item => item.activityId === incoming.activityId);
      if (index !== -1) {
        state.filters[index] = { ...state.filters[index], ...incoming }; // update
      } else {
        state.filters.push(incoming); // add
      }
    },
    resetFilters(state) {
      state.filters = [];
    },
    removeFilters(state,action) {
      const activityIdToRemove = action.payload;
      state.filters = state.filters.filter(p=>p.activityId != activityIdToRemove.activityId);
    },
  },
});

export const filterActions = filterSlice.actions;

export default filterSlice;