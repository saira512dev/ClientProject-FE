import React, {useEffect} from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function RequireAuth({ Component }) {
  const user = useSelector((state) => state.global.user);
  console.log(user+"RQ")
  if (user == null) {
    return <Navigate to="/" />;
  }
  return <Component />;
}
export default RequireAuth;
