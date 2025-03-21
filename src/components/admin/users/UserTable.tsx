
import React from 'react';
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
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { UserProfile } from '@/types/admin';

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  onEditUser: (user: UserProfile) => void;
}

const UserTable = ({ users, loading, onEditUser }: UserTableProps) => {
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
          {users.map((user) => (
            <TableRow key={user.id}>
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
                <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
                  Chỉnh sửa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
