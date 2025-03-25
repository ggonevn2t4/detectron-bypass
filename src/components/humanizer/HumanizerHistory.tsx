
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Copy, ArrowRight, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyState } from '@/components/ui/empty-state';

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Load history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('humanizer_history');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Văn bản đã được sao chép vào clipboard",
    });
  };

  const handleDownload = (text: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Đã tải xuống",
      description: `Văn bản đã được tải xuống dưới dạng ${filename}`,
    });
  };

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('humanizer_history', JSON.stringify(updatedHistory));
    
    toast({
      title: "Đã xóa",
      description: "Mục đã được xóa khỏi lịch sử",
    });
  };

  const handleClearAll = () => {
    setHistory([]);
    localStorage.setItem('humanizer_history', JSON.stringify([]));
    
    toast({
      title: "Đã xóa tất cả",
      description: "Lịch sử đã được xóa",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử Humanization</CardTitle>
          <CardDescription>Đang tải lịch sử...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle>Lịch sử Humanization</CardTitle>
          <CardDescription>Các văn bản đã humanize sẽ xuất hiện ở đây</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<History className="h-10 w-10 text-muted-foreground/60" />}
            title="Chưa có lịch sử"
            description="Khi bạn sử dụng công cụ Humanizer, các văn bản sẽ được lưu lại ở đây để tham khảo sau này."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Lịch sử Humanization</h2>
        <Button variant="outline" onClick={handleClearAll} className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" /> Xóa tất cả
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item) => (
          <Card key={item.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    {item.originalText.substring(0, 60)}...
                  </CardTitle>
                  <CardDescription>{new Date(item.timestamp).toLocaleString()}</CardDescription>
                </div>
                <Badge variant={item.humanScore >= 95 ? "success" : "secondary"}>
                  {item.humanScore}% Human
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm line-clamp-3">{item.humanizedText}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Humanized Text Details</DialogTitle>
                    <DialogDescription>
                      {new Date(item.timestamp).toLocaleString()} · {item.humanScore}% Human
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Original Text</h3>
                      <ScrollArea className="h-[300px] rounded-md border p-4">
                        {item.originalText}
                      </ScrollArea>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Humanized Text</h3>
                      <ScrollArea className="h-[300px] rounded-md border p-4">
                        {item.humanizedText}
                      </ScrollArea>
                    </div>
                  </div>
                  
                  <DialogFooter className="flex justify-between items-center mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleCopy(item.humanizedText)}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => handleDownload(item.humanizedText, `humanized-text-${new Date(item.timestamp).toISOString().split('T')[0]}.txt`)}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HumanizerHistory;
