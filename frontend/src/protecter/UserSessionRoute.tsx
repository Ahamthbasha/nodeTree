import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {type RootState } from '../redux/store';

interface UserSessionRouteProps {
  children: React.ReactNode;
}

const UserSessionRoute: React.FC<UserSessionRouteProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = Boolean(user.userId && user.email);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default UserSessionRoute;