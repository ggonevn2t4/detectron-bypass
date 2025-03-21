
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Languages, Copy, Download, RefreshCw, 
  SwitchCamera, CheckCircle, FileText 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translateText, TranslationOptions } from '@/services/ai';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Danh sách ngôn ngữ phổ biến
const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'en', name: 'Tiếng Anh' },
  { code: 'fr', name: 'Tiếng Pháp' },
  { code: 'de', name: 'Tiếng Đức' },
  { code: 'es', name: 'Tiếng Tây Ban Nha' },
  { code: 'it', name: 'Tiếng Ý' },
  { code: 'ja', name: 'Tiếng Nhật' },
  { code: 'ko', name: 'Tiếng Hàn' },
  { code: 'zh', name: 'Tiếng Trung' },
  { code: 'ru', name: 'Tiếng Nga' },
  { code: 'ar', name: 'Tiếng Ả Rập' },
  { code: 'hi', name: 'Tiếng Hindi' },
  { code: 'pt', name: 'Tiếng Bồ Đào Nha' },
  { code: 'nl', name: 'Tiếng Hà Lan' },
  { code: 'sv', name: 'Tiếng Thụy Điển' },
];

const TranslationTool: React.FC = () => {
  const { toast } = useToast();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [preserveTone, setPreserveTone] = useState(true);
  const [formalityLevel, setFormalityLevel] = useState<'casual' | 'standard' | 'formal'>('standard');
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Cập nhật đếm từ khi văn bản nguồn thay đổi
    const words = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [sourceText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto' && translatedText) {
      // Hoán đổi ngôn ngữ và văn bản
      const tempLang = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(tempLang);

      setSourceText(translatedText);
      setTranslatedText('');
    } else {
      toast({
        title: "Không thể hoán đổi",
        description: "Cần chọn ngôn ngữ nguồn cụ thể và có văn bản đã dịch",
        variant: "default",
      });
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Văn bản trống",
        description: "Vui lòng nhập văn bản để dịch",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgressValue(0);

    // Mô phỏng tiến trình
    const progressInterval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 300);

    try {
      const options: TranslationOptions = {
        sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
        targetLanguage: LANGUAGES.find(lang => lang.code === targetLanguage)?.name || targetLanguage,
        preserveFormatting,
        preserveTone,
        formalityLevel
      };

      const result = await translateText(sourceText, options);
      setTranslatedText(result.translatedText);

      toast({
        title: "Dịch thuật hoàn tất",
        description: `Đã dịch sang ${LANGUAGES.find(lang => lang.code === targetLanguage)?.name || targetLanguage}`,
      });
    } catch (error) {
      console.error("Lỗi dịch thuật:", error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi dịch thuật",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setProgressValue(100);
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Đã sao chép",
      description: "Văn bản đã được sao chép vào clipboard",
    });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([translatedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `translated-${targetLanguage}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Đã tải xuống",
      description: `Văn bản đã dịch đã được tải xuống`,
    });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border border-border/60">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Văn bản nguồn</h3>
              <div className="flex items-center">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn ngôn ngữ nguồn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Tự động phát hiện</SelectItem>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <Textarea
                placeholder="Nhập văn bản cần dịch..."
                className="min-h-[250px] resize-none p-4 text-base"
                value={sourceText}
                onChange={handleInputChange}
                disabled={isProcessing}
              />
              <div className="absolute bottom-3 right-3 flex items-center bg-background/90 text-xs text-muted-foreground px-2 py-1 rounded">
                <FileText className="h-3 w-3 mr-1" />
                {wordCount} từ
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="default"
                onClick={handleTranslate}
                disabled={isProcessing || !sourceText.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang dịch...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    Dịch ngay
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border/60">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Văn bản đã dịch</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-2"
                  onClick={handleSwapLanguages}
                  disabled={isProcessing || sourceLanguage === 'auto' || !translatedText}
                >
                  <SwitchCamera className="h-4 w-4" />
                </Button>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn ngôn ngữ đích" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isProcessing && (
              <div className="mb-4 animate-in fade-in-50 duration-300">
                <Progress value={progressValue} className="h-2 bg-muted/50" />
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {progressValue < 30
                      ? 'Phân tích văn bản...'
                      : progressValue < 60
                      ? 'Dịch thuật...'
                      : progressValue < 95
                      ? 'Hoàn thiện...'
                      : 'Hoàn tất!'}
                  </p>
                  <p className="text-xs font-medium">{Math.round(progressValue)}%</p>
                </div>
              </div>
            )}

            <div className="relative">
              <Textarea
                placeholder="Văn bản đã dịch sẽ xuất hiện ở đây..."
                className="min-h-[250px] resize-none p-4 text-base"
                value={translatedText}
                readOnly
              />

              {translatedText && (
                <div className="absolute bottom-3 right-3 flex space-x-2 bg-background/80 backdrop-blur-sm rounded p-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-xs"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3.5 w-3.5" />
                        Sao chép
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!translatedText}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-sm border border-border/60">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Tùy chọn nâng cao</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-formatting"
                checked={preserveFormatting}
                onCheckedChange={setPreserveFormatting}
              />
              <Label htmlFor="preserve-formatting">Giữ định dạng</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-tone"
                checked={preserveTone}
                onCheckedChange={setPreserveTone}
              />
              <Label htmlFor="preserve-tone">Giữ giọng điệu</Label>
            </div>

            <div>
              <Select
                value={formalityLevel}
                onValueChange={(value: 'casual' | 'standard' | 'formal') => setFormalityLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mức độ trang trọng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Thân mật</SelectItem>
                  <SelectItem value="standard">Tiêu chuẩn</SelectItem>
                  <SelectItem value="formal">Trang trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationTool;
