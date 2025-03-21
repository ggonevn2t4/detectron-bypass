
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SubscriptionSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SubscriptionSearch = ({ searchTerm, onSearchChange }: SubscriptionSearchProps) => {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
      <Input 
        placeholder="Tìm kiếm thuê bao..." 
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SubscriptionSearch;
