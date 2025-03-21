
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserSearch = ({ searchTerm, onSearchChange }: UserSearchProps) => {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
      <Input 
        placeholder="Tìm kiếm người dùng..." 
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

export default UserSearch;
