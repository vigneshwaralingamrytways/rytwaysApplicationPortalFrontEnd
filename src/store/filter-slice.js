import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'filterState';

const loadState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
};

const saveState = (filters, filterData) => {
  try {
    const serialized = JSON.stringify({ filters, filterData });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) { }
};

const persistedState = loadState();

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    filters: [],
    
    activeActivityId: null,
    ...persistedState,
  },

  reducers: {
    setFilters(state, action) {
      const incoming = action.payload;

      const index = state.filters.findIndex(
        item => item.activityId === incoming.activityId
      );

      if (index !== -1) {
        state.filters[index] = {
          ...state.filters[index],
          ...incoming
        };
      } else {
        state.filters.push(incoming);
      }

      saveState(state.filters, state.filterData);
    },

    

    enterActivity(state, action) {
      const newActivityId = action.payload;

      if (
        state.activeActivityId &&
        state.activeActivityId !== newActivityId
      ) {
        state.filters = state.filters.filter(f => f.activityId !== state.activeActivityId);
        state.filterData = state.filterData.filter(f => f.activityId !== state.activeActivityId);
        saveState(state.filters, state.filterData);
      }

      state.activeActivityId = newActivityId;
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

    

    
  },
});

export const filterActions = filterSlice.actions;

export default filterSlice;