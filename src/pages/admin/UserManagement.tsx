
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  subscription?: {
    plan_id: string;
    status: string;
  } | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch user emails from auth.users (you'll need an admin function for this in production)
      // For demo purposes, we'll use sample data
      const userProfiles = await Promise.all(
        profiles.map(async (profile) => {
          // Get subscription info
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan_id, status')
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            ...profile,
            // In production, you'd get this from auth.users
            email: `user_${profile.id.substring(0, 6)}@example.com`,
            subscription: subscription || null
          };
        })
      );

      setUsers(userProfiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách người dùng',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: selectedUser.username,
          full_name: selectedUser.full_name,
          avatar_url: selectedUser.avatar_url,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update the local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));

      toast({
        title: 'Thành công',
        description: 'Thông tin người dùng đã được cập nhật',
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin người dùng',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý người dùng</CardTitle>
        <CardDescription>Xem và quản lý tài khoản người dùng trong hệ thống</CardDescription>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
          <Input 
            placeholder="Tìm kiếm người dùng..." 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
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
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
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
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          Chỉnh sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin của người dùng này
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Tên người dùng
                  </Label>
                  <Input
                    id="username"
                    value={selectedUser.username || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullname" className="text-right">
                    Họ và tên
                  </Label>
                  <Input
                    id="fullname"
                    value={selectedUser.full_name || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, full_name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatar" className="text-right">
                    URL ảnh đại diện
                  </Label>
                  <Input
                    id="avatar"
                    value={selectedUser.avatar_url || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, avatar_url: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={handleSaveUser}>
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
