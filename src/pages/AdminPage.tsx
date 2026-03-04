import React from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useAuthStore } from '../store/authStore';

const AdminPage: React.FC = () => {
    const adminToken = useAuthStore(s => s.adminToken);
    return adminToken ? <AdminDashboard /> : <AdminLogin />;
};

export default AdminPage;
