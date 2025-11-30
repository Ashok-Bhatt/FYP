import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

interface ProtectedRouteProps {
    children: ReactNode;
    role?: 'AGENT' | 'PARTNER' | 'ADMIN' | 'USER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user || (role && user.role !== role)) return <Login />;

    return <>{children}</>;
};

export default ProtectedRoute;
