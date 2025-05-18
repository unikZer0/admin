import { Navigate } from "react-router";

import React, { JSX } from 'react'

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute :React.FC<ProtectedRouteProps> = ({children}) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role')
    if (!token || (userRole =='3' )) {
        return <Navigate to="/"/>
    }
  return children;
}

export default ProtectedRoute
