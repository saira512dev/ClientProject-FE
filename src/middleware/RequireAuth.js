import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {fetchUser} from "../state"

function RequireAuth({ Component }) {
  // const dispatch = useDispatch()
  // dispatch(fetchUser())
  const user = useSelector((state) => state.global.user);
  console.log(user+"RQ")
  if (!user) {
    return <Navigate to="/" />;
  }
  return <Component />;
}
export default RequireAuth;
