
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subscription } from '@/types/admin';

interface SubscriptionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubscription: Subscription | null;
  onSelectedSubscriptionChange: (subscription: Subscription) => void;
  onSave: () => void;
}

const SubscriptionEditDialog = ({
  open,
  onOpenChange,
  selectedSubscription,
  onSelectedSubscriptionChange,
  onSave
}: SubscriptionEditDialogProps) => {
  if (!selectedSubscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thuê bao</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin thuê bao
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plan" className="text-right">
              Gói thuê bao
            </Label>
            <Select 
              value={selectedSubscription.plan_id}
              onValueChange={(value) => onSelectedSubscriptionChange({...selectedSubscription, plan_id: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn gói thuê bao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Trạng thái
            </Label>
            <Select 
              value={selectedSubscription.status}
              onValueChange={(value) => onSelectedSubscriptionChange({...selectedSubscription, status: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="trialing">Dùng thử</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="past_due">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment" className="text-right">
              Phương thức thanh toán
            </Label>
            <Select 
              value={selectedSubscription.payment_method}
              onValueChange={(value) => onSelectedSubscriptionChange({...selectedSubscription, payment_method: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                <SelectItem value="manual">Thủ công</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">
              Ngày hết hạn
            </Label>
            <Input
              id="expiry"
              type="date"
              value={new Date(selectedSubscription.current_period_end).toISOString().split('T')[0]}
              onChange={(e) => onSelectedSubscriptionChange({
                ...selectedSubscription, 
                current_period_end: new Date(e.target.value).toISOString()
              })}
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

export default SubscriptionEditDialog;
