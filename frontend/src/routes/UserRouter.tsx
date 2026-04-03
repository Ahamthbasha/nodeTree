import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/user/Auth/Login';
import UserSessionRoute from '../protecter/UserSessionRoute';
import PrivateRoute from '../protecter/UserPrivateRoute';
import Dashboard from '../pages/user/MainPage/Dashboard';

const UserRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path='/user/login' 
        element={
          <UserSessionRoute>
            <LoginPage />
          </UserSessionRoute>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path='/dashboard' 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Root path - redirect based on authentication */}
      <Route 
        path='/' 
        element={
          <Navigate to="/dashboard" replace />
        } 
      />
      
      {/* Catch all - redirect to dashboard */}
      <Route 
        path='*' 
        element={
          <Navigate to="/dashboard" replace />
        } 
      />
    </Routes>
  );
};

export default UserRouter;