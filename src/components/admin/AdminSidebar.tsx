
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, LineChart, CreditCard, Settings, Home } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r hidden md:block">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Quản trị viên</h2>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
          }
        >
          <Home className="h-5 w-5 mr-3 text-gray-500" />
          <span>Tổng quan</span>
        </NavLink>
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
          }
        >
          <Users className="h-5 w-5 mr-3 text-gray-500" />
          <span>Người dùng</span>
        </NavLink>
        <NavLink 
          to="/admin/subscriptions" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
          }
        >
          <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
          <span>Thuê bao</span>
        </NavLink>
        <NavLink 
          to="/admin/analytics" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
          }
        >
          <LineChart className="h-5 w-5 mr-3 text-gray-500" />
          <span>Phân tích</span>
        </NavLink>
        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
          }
        >
          <Settings className="h-5 w-5 mr-3 text-gray-500" />
          <span>Cài đặt</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
