
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/types/admin';

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: UserProfile | null;
  onSelectedUserChange: (user: UserProfile) => void;
  onSave: () => void;
}

const UserEditDialog = ({
  open,
  onOpenChange,
  selectedUser,
  onSelectedUserChange,
  onSave
}: UserEditDialogProps) => {
  if (!selectedUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin của người dùng này
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Tên người dùng
            </Label>
            <Input
              id="username"
              value={selectedUser.username || ''}
              onChange={(e) => onSelectedUserChange({...selectedUser, username: e.target.value})}
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
              onChange={(e) => onSelectedUserChange({...selectedUser, full_name: e.target.value})}
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
              onChange={(e) => onSelectedUserChange({...selectedUser, avatar_url: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" onClick={onSave}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
