
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface HistoryToggleProps {
  historyCount: number;
  onToggleHistory: () => void;
}

const HistoryToggle: React.FC<HistoryToggleProps> = ({ 
  historyCount, 
  onToggleHistory 
}) => {
  return (
    <div className="p-3 bg-muted/30 border-b border-border">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full" 
        onClick={onToggleHistory}
      >
        <Clock className="h-4 w-4 mr-2" />
        Xem lịch sử phân tích ({historyCount})
      </Button>
    </div>
  );
};

export default HistoryToggle;
