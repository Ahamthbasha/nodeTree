import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {type RootState } from '../redux/store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = Boolean(user.userId && user.email);

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/user/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;