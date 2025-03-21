
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SubscriptionSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SubscriptionSearch = ({ searchTerm, onSearchChange }: SubscriptionSearchProps) => {
  const handleClearSearch = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onSearchChange(event);
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Tìm kiếm thuê bao, người dùng, trạng thái..." 
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-9"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSearch;
