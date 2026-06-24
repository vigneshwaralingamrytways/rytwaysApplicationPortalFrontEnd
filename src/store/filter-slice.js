import React from 'react'
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'filterState';

const loadState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return undefined;
    }
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
};

const saveState = (filters, filterData) => {
  try {
    const serialized = JSON.stringify({ filters, filterData });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
  }
};

const persistedState = loadState();

const filterSlice = createSlice({
  name: 'filter',
  initialState: persistedState || {
    filters: [],
    filterData: [],
  },
  reducers: {
    setFilters(state, action) {
      const incoming = action.payload;

      const index = state.filters.findIndex(item => item.activityId === incoming.activityId);
      if (index !== -1) {
        state.filters[index] = { ...state.filters[index], ...incoming };
      } else {
        state.filters.push(incoming);
      }

      saveState(state.filters, state.filterData);
    },
    
    updateFilterData(state, action) {
      const incoming = action.payload;

      const index = state.filterData.findIndex(
        item => item.activityId === incoming.activityId
      );

      if (index !== -1) {
        state.filterData[index] = incoming;
      } else {
        state.filterData.push(incoming);
      }

      saveState(state.filters, state.filterData);
    },
    
    clearActivityFilter(state, action) {
      const activityId = action.payload;

      state.filterData = state.filterData.filter(
        x => x.activityId !== activityId
      );

      state.filters = state.filters.filter(
        x => x.activityId !== activityId
      );

      saveState(state.filters, state.filterData);
    },
    
    resetFilters(state) {
      state.filters = [];
      state.filterData = [];

      saveState(state.filters, state.filterData);
    },
    
    removeFilters(state, action) {
      const activityIdToRemove = action.payload;
      state.filters = state.filters.filter(p => p.activityId != activityIdToRemove.activityId);

      saveState(state.filters, state.filterData);
    },
  },
});

export const filterActions = filterSlice.actions;

export default filterSlice;