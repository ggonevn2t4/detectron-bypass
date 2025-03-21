
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Trash } from 'lucide-react';
import { HistoryItem } from './hooks/useDetectorState';
import { formatTimestamp } from './utils/formatUtils';

interface DetectorHistoryProps {
  history: HistoryItem[];
  showHistory: boolean;
  isMobile: boolean;
  onHistoryItemClick: (item: HistoryItem, isMobile: boolean) => void;
  onClearHistory: () => void;
  onCloseHistory: () => void;
}

const DetectorHistory: React.FC<DetectorHistoryProps> = ({
  history,
  showHistory,
  isMobile,
  onHistoryItemClick,
  onClearHistory,
  onCloseHistory
}) => {
  if (!showHistory && isMobile) {
    return null;
  }

  return (
    <Card className={`${isMobile ? 'fixed inset-0 z-50 overflow-auto' : 'h-full'} bg-card shadow-sm border border-border`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
        <CardTitle className="text-xl font-medium flex items-center">
          <Clock className="h-5 w-5 text-primary mr-2" />
          Lịch sử phân tích
        </CardTitle>
        <div className="flex space-x-2">
          {isMobile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCloseHistory}
            >
              Đóng
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4 mr-1" />
            Xóa lịch sử
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Chưa có lịch sử phân tích nào
          </p>
        ) : (
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="space-y-3 pr-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onHistoryItemClick(item, isMobile)}
                  className="p-3 rounded-md border border-border/60 hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <span 
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          item.result && item.result.score >= 90 
                            ? 'bg-red-500' 
                            : item.result && item.result.score >= 70 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                        }`}
                      />
                      <span className="font-medium">
                        {item.result ? `${item.result.score}% AI` : 'Chưa phân tích'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(item.date)}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default DetectorHistory;
