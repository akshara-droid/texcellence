import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return user.role === role ? children : <Navigate to={user.role === 'admin' ? '/' : '/driver'} />;
};

export default RoleRoute;
