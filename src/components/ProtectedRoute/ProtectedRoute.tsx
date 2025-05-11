import { Navigate } from "react-router";

import React, { JSX } from 'react'

interface ProtectedRouteProps {
    childen: JSX.Element;
}

const ProtectedRoute :React.FC<ProtectedRouteProps> = ({childen}) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role')
    if (!token || (userRole != '1' && userRole != '2')) {
        return <Navigate to="/"/>
    }
  return childen;
}

export default ProtectedRoute
