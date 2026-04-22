import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const orderEntrySlice = createSlice({
  name: 'orderState',
  initialState: {
      orderSearch:0,
      orderEntry:0,
      monthlyPlan:0,
      dailyPlan:0,
      jobOrder:0,
      processView:0,
      approval:0,
  },
  reducers: {
    alterOrderSearchlHandler(state,action) {
      state.orderSearch = Math.random();
      console.log(state.orderSearch)
    },
    alterOrderEntrylHandler(state,action) {
      state.orderEntry = Math.random();
  },
  alterMonthlyPlanHandler(state,action) {
    state.monthlyPlan = Math.random();
  },
  alterDailyPlanHandler(state,action) {
    state.dailyPlan = Math.random();
  },
  alterJobOrderHandler(state,action) {
  state.jobOrder = Math.random();
  },
  alterProcessViewHandler(state,action) {
    state.processView = Math.random();
    },
  alterApprovalHandler(state,action) {
      state.approval = Math.random();
      console.log(state.approval)
      }

  },
});

export const orderEntryActions = orderEntrySlice.actions;

export default orderEntrySlice;