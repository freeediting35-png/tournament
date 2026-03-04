import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({
    children,
    requireAdmin = false,
}) => {
    const { user, loading, adminToken } = useAuthStore();

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <LoadingSpinner size={48} message="Loading BlazeFire Arena..." />
            </div>
        );
    }

    if (requireAdmin && !adminToken) {
        return <Navigate to="/admin" replace />;
    }

    if (!requireAdmin && !user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
