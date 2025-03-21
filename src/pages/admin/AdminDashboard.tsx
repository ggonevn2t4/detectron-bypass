
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminMobileNav from '@/components/admin/AdminMobileNav';
import UserManagement from './UserManagement';
import SubscriptionManagement from './SubscriptionManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import Dashboard from './Dashboard';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Quản trị viên</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Quản lý người dùng và thuê bao
              </p>
            </div>
            <AdminMobileNav />
          </div>
          
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="subscriptions" element={<SubscriptionManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
