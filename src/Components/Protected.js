import React from 'react'
import { Redirect } from 'react-router-dom'

import { useSelector, useDispatch } from "react-redux";
import { modalActions } from "../store/modal-Slice";
import { alertActions } from "../store/alert-slice";

function Protected({ isSignedIn, children }) {
  if (!isSignedIn) {
    return <Redirect
    to={{
      pathname: "/",
    }}
  />
  
  }
  return children
}
export default Protected