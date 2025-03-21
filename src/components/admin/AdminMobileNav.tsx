
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, LineChart, CreditCard, Settings, Home, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminMobileNav = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 md:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-6">Quản trị viên</h2>
          <nav className="space-y-3">
            <NavLink 
              to="/admin" 
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
              }
            >
              <Home className="h-5 w-5 mr-3 text-gray-500" />
              <span>Tổng quan</span>
            </NavLink>
            <NavLink 
              to="/admin/users" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
              }
            >
              <Users className="h-5 w-5 mr-3 text-gray-500" />
              <span>Người dùng</span>
            </NavLink>
            <NavLink 
              to="/admin/subscriptions" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
              }
            >
              <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
              <span>Thuê bao</span>
            </NavLink>
            <NavLink 
              to="/admin/analytics" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
              }
            >
              <LineChart className="h-5 w-5 mr-3 text-gray-500" />
              <span>Phân tích</span>
            </NavLink>
            <NavLink 
              to="/admin/settings" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-medium' : ''}`
              }
            >
              <Settings className="h-5 w-5 mr-3 text-gray-500" />
              <span>Cài đặt</span>
            </NavLink>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileNav;
