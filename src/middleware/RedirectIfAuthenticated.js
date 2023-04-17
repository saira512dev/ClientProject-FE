import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetAuthUserQuery } from "../state/api";
import {fetchUser} from "../state"

function RedirectIfAuthenticated({ Component }) {
  // const dispatch = useDispatch()
  // dispatch(fetchUser())
  const user = useSelector((state) => state.global.user);
  // const user = useGetAuthUserQuery().currentData
  console.log(user)
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  return <Component />;
}
export default RedirectIfAuthenticated;
