
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface InputHeaderProps {
  wordCount: number;
}

const InputHeader: React.FC<InputHeaderProps> = ({ wordCount }) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-medium">Text to Analyze</h3>
      <Badge variant="info" className="px-3 py-1">
        <span className="font-medium">{wordCount} words</span>
      </Badge>
    </div>
  );
};

export default InputHeader;
