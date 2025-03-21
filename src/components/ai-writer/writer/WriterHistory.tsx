
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Eye, Download, Calendar, AlignLeft, BadgeCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContentHistoryItem {
  id: string;
  title: string;
  content: string;
  topic: string;
  length: string;
  tone: string;
  format: string;
  audience: string;
  word_count: number;
  quality_score: number;
  created_at: string;
}

interface WriterHistoryProps {
  onSelectContent: (content: ContentHistoryItem) => void;
}

const WriterHistory: React.FC<WriterHistoryProps> = ({ onSelectContent }) => {
  const [historyItems, setHistoryItems] = useState<ContentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingContent, setViewingContent] = useState<ContentHistoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setHistoryItems(data || []);
    } catch (error) {
      console.error('Error fetching content history:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử nội dung",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleViewContent = (item: ContentHistoryItem) => {
    setViewingContent(item);
  };

  const handleUseContent = (item: ContentHistoryItem) => {
    onSelectContent(item);
    toast({
      title: "Đã áp dụng nội dung",
      description: "Nội dung đã được đưa vào trình soạn thảo",
    });
  };

  const handleDeleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_history')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setHistoryItems(historyItems.filter(item => item.id !== id));
      toast({
        title: "Đã xóa",
        description: "Nội dung đã được xóa khỏi lịch sử",
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa nội dung",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDownloadContent = (item: ContentHistoryItem) => {
    const element = document.createElement('a');
    const file = new Blob([item.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Đã tải xuống",
      description: "Nội dung đã được tải xuống",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return 'Không xác định';
    }
  };

  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'blog':
        return 'bg-green-100 text-green-800';
      case 'essay':
        return 'bg-purple-100 text-purple-800';
      case 'story':
        return 'bg-orange-100 text-orange-800';
      case 'summary':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Vui lòng đăng nhập</h3>
          <p className="text-muted-foreground">Đăng nhập để xem lịch sử nội dung của bạn</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Lịch sử nội dung đã tạo</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistory}
          disabled={loading}
        >
          Làm mới
        </Button>
      </div>

      <Separator className="my-3" />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : historyItems.length > 0 ? (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {historyItems.map((item) => (
            <Card key={item.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-base line-clamp-1">{item.title}</h4>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground space-x-3">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <AlignLeft className="h-3.5 w-3.5 mr-1" />
                      <span>{item.word_count} từ</span>
                    </div>
                    <div className="flex items-center">
                      <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                      <span>{item.quality_score}% Chất lượng</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-1 ml-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getFormatBadgeColor(item.format)}`}>
                    {item.format}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.content}</p>
              <div className="flex justify-end mt-3 space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setItemToDelete(item.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadContent(item)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Tải xuống
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewContent(item)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleUseContent(item)}
                >
                  Sử dụng
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h4 className="text-lg font-medium mb-2">Chưa có nội dung</h4>
          <p className="text-muted-foreground">
            Hãy tạo nội dung mới và lưu để xem lịch sử ở đây
          </p>
        </div>
      )}

      {/* Dialog for viewing content */}
      <Dialog open={!!viewingContent} onOpenChange={() => setViewingContent(null)}>
        {viewingContent && (
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingContent.title}</DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {viewingContent.format}
                  </span>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {viewingContent.tone}
                  </span>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {viewingContent.length}
                  </span>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {viewingContent.audience}
                  </span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 whitespace-pre-line">{viewingContent.content}</div>
            <div className="flex justify-end mt-4 space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Đóng</Button>
              </DialogClose>
              <Button onClick={() => handleUseContent(viewingContent)}>Sử dụng nội dung này</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Alert dialog for deleting content */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác. Nội dung này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => itemToDelete && handleDeleteContent(itemToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default WriterHistory;
