import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetAuthUserQuery } from "../state/api";

function RedirectIfAuthenticated({ Component }) {
  const user = useSelector((state) => state.global.user);
  if (user && user._id) {
    return <Navigate to="/dashboard" />;
  }
  return <Component />;
}
export default RedirectIfAuthenticated;
