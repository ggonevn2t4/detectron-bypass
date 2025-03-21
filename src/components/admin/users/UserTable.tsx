
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowUp, 
  ArrowDown,
  Trash,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '@/types/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  onEditUser: (user: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
}

type SortField = 'username' | 'email' | 'created_at' | 'subscription';
type SortDirection = 'asc' | 'desc';

const UserTable = ({ 
  users, 
  loading, 
  onEditUser,
  onDeleteUser
}: UserTableProps) => {
  const [sortField, setSortField] = useState<SortField>('username');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (sortField === 'username') {
      valueA = a.full_name || a.username || '';
      valueB = b.full_name || b.username || '';
    } else if (sortField === 'created_at') {
      valueA = new Date(a.created_at).getTime();
      valueB = new Date(b.created_at).getTime();
    } else if (sortField === 'subscription') {
      valueA = a.subscription?.plan_id || '';
      valueB = b.subscription?.plan_id || '';
    } else {
      valueA = a[sortField] || '';
      valueB = b[sortField] || '';
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4" /> : 
      <ArrowDown className="ml-1 h-4 w-4" />;
  };

  const confirmDelete = (user: UserProfile) => {
    setUserToDelete(user);
  };

  const handleDeleteConfirmed = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancelled = () => {
    setUserToDelete(null);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ngày đăng ký</TableHead>
              <TableHead>Gói thuê bao</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Không tìm thấy người dùng nào
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('username')}
              >
                <div className="flex items-center">
                  Người dùng
                  {getSortIcon('username')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {getSortIcon('email')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center">
                  Ngày đăng ký
                  {getSortIcon('created_at')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('subscription')}
              >
                <div className="flex items-center">
                  Gói thuê bao
                  {getSortIcon('subscription')}
                </div>
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>{getInitials(user.full_name || user.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name || user.username || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">@{user.username || 'unnamed'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.subscription ? (
                    <Badge variant="outline">{user.subscription.plan_id}</Badge>
                  ) : (
                    <Badge variant="outline">Free</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.subscription?.status === 'active' ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="mr-1 h-3 w-3" /> Hoạt động
                    </Badge>
                  ) : user.subscription?.status ? (
                    <Badge variant="secondary">
                      <AlertCircle className="mr-1 h-3 w-3" /> {user.subscription.status}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Không có thuê bao
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive" 
                      onClick={() => confirmDelete(user)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác và có thể ảnh hưởng đến dữ liệu liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancelled}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash className="h-4 w-4 mr-2" /> Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTable;
