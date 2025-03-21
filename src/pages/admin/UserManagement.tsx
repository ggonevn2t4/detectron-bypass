
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UserTable from '@/components/admin/users/UserTable';
import UserEditDialog from '@/components/admin/users/UserEditDialog';
import UserSearch from '@/components/admin/users/UserSearch';
import { useUserManagement } from '@/hooks/admin/useUserManagement';

const UserManagement = () => {
  const {
    users,
    loading,
    searchTerm,
    isEditDialogOpen,
    selectedUser,
    handleSearch,
    handleEditUser,
    setSelectedUser,
    setIsEditDialogOpen,
    handleSaveUser,
  } = useUserManagement();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý người dùng</CardTitle>
        <CardDescription>Xem và quản lý tài khoản người dùng trong hệ thống</CardDescription>
        <UserSearch 
          searchTerm={searchTerm} 
          onSearchChange={handleSearch} 
        />
      </CardHeader>
      <CardContent>
        <UserTable 
          users={users} 
          loading={loading} 
          onEditUser={handleEditUser} 
        />

        <UserEditDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          selectedUser={selectedUser}
          onSelectedUserChange={setSelectedUser}
          onSave={handleSaveUser}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
