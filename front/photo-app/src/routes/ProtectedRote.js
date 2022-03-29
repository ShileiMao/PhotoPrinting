import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  checkLogin,
  redirectPath = '/admin',
  children,
}) => {
  
  if (!checkLogin()) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};


export default ProtectedRoute;