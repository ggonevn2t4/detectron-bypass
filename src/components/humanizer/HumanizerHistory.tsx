
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyState } from '@/components/ui/empty-state';
import { format } from 'date-fns';
import { 
  Clock, 
  Copy, 
  Download, 
  FileText, 
  HistoryIcon, 
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HistoryItem {
  id: string;
  originalText: string;
  humanizedText: string;
  humanScore: number;
  timestamp: string;
}

const HumanizerHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('humanizer_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard",
    });
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    try {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('humanizer_history', JSON.stringify(updatedHistory));
      
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
      
      toast({
        title: "Đã xóa",
        description: "Mục đã được xóa khỏi lịch sử",
      });
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  };

  const handleClearAll = () => {
    try {
      setHistory([]);
      localStorage.removeItem('humanizer_history');
      setSelectedItem(null);
      
      toast({
        title: "Đã xóa tất cả",
        description: "Lịch sử đã được xóa hoàn toàn",
      });
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  if (history.length === 0) {
    return (
      <EmptyState
        icon={<HistoryIcon className="h-10 w-10 text-muted-foreground" />}
        title="Không có lịch sử"
        description="Lịch sử humanization sẽ hiển thị ở đây sau khi bạn sử dụng công cụ."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Lịch sử Humanization</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Xóa tất cả
            </Button>
          </div>
          <CardDescription>
            {history.length} mục gần đây nhất
          </CardDescription>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          {history.map((item) => (
            <div 
              key={item.id}
              className={`px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${selectedItem?.id === item.id ? 'bg-muted' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-medium line-clamp-1">{item.originalText.substring(0, 50)}...</p>
                <Badge className="ml-2 whitespace-nowrap">{item.humanScore}%</Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{format(new Date(item.timestamp), 'dd MMM yyyy, HH:mm')}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </Card>
      
      {selectedItem ? (
        <Card className="md:col-span-2 border border-border/60">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Chi tiết</CardTitle>
              <Badge>{selectedItem.humanScore}% human-like</Badge>
            </div>
            <CardDescription>
              {format(new Date(selectedItem.timestamp), 'dd MMMM yyyy, HH:mm:ss')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                Văn bản gốc
              </h3>
              <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap text-sm max-h-[150px] overflow-y-auto">
                {selectedItem.originalText}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-1 text-primary" />
                Văn bản đã humanize
              </h3>
              <div className="bg-primary/5 border border-primary/10 p-3 rounded-md whitespace-pre-wrap text-sm max-h-[200px] overflow-y-auto">
                {selectedItem.humanizedText}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDelete(selectedItem.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Xóa
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopy(selectedItem.humanizedText)}
              >
                <Copy className="h-4 w-4 mr-1" /> Sao chép
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => handleDownload(
                  selectedItem.humanizedText, 
                  `humanized-text-${format(new Date(selectedItem.timestamp), 'yyyyMMdd-HHmmss')}.txt`
                )}
              >
                <Download className="h-4 w-4 mr-1" /> Tải xuống
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="md:col-span-2 flex items-center justify-center p-6 border border-border/60">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Chọn một mục từ lịch sử</h3>
            <p className="text-muted-foreground">Nhấp vào một mục từ danh sách bên trái để xem chi tiết.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HumanizerHistory;
