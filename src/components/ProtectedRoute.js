import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = React.memo(({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
});

export default ProtectedRoute;
