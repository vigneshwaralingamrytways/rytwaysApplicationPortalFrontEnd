/* import { createSlice } from '@reduxjs/toolkit';


const moduleSlice = createSlice({
  name: 'sideBar',
  initialState: {
      moduleId:"",
      sidebardata:[],
      showsideBar:false
  },
  reducers: {
    selectModuleId(state, action) {
      state.moduleId = action.payload.moduleId;
      console.log(action.payload.moduleId)
    }
  },
});

export const moduleActions = moduleSlice.actions;

export default moduleSlice; */


import { createSlice } from '@reduxjs/toolkit';

const moduleSlice = createSlice({
  name: 'sideBar',
  initialState: {
    processId: "",
    moduleId: "",
    activityId: "",
    functionPath: "",
    functionTittle: "",
    processTittle: "",
    activityTittle: "",
    sidebardata: [],
    showsideBar: false,
    showAllActivities:false,
  },
  reducers: {
    // ? Safe update: preserves previous values if not provided
    selectModuleId(state, action) {
      const payload = action.payload;
      state.processId = payload.processId ?? state.processId;
      state.moduleId = payload.moduleId ?? state.moduleId;
      state.activityId = payload.activityId ?? state.activityId;
      state.functionPath = payload.functionPath ?? state.functionPath;
      state.functionTittle = payload.functionTittle ?? state.functionTittle;
      state.processTittle = payload.processTittle ?? state.processTittle;
      state.activityTittle = payload.activityTittle ?? state.activityTittle;
      state.showAllActivities = payload.showAllActivities ?? state.showAllActivities;
    },

    // ? Optional: update only activityId
    selectActivityId(state, action) {
      state.activityId = action.payload.activityId;
    },

    // Optional: update sidebardata
    setSideBarData(state, action) {
      state.sidebardata = action.payload;
    },

    // Optional: toggle sidebar visibility
    toggleSidebar(state) {
      state.showsideBar = !state.showsideBar;
    }
  },
});

export const moduleActions = moduleSlice.actions;
export default moduleSlice;
