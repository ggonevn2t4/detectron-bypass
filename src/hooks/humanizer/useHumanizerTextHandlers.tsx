
import { useToast } from "@/hooks/use-toast";
import { sampleTexts } from '@/components/humanizer/SampleTexts';

export const useHumanizerTextHandlers = (
  setInputText: (text: string) => void,
  setWordCount: (count: number) => void
) => {
  const { toast } = useToast();

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateWordCount(text);
  };

  const handleSampleText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setInputText(sampleTexts[randomIndex]);
    updateWordCount(sampleTexts[randomIndex]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    });
  };
  
  const handleDownload = (text: string, filename: string) => {
    if (!text) return;
    
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download complete",
      description: `Your text has been downloaded as ${filename}`,
    });
  };

  return {
    handleInputChange,
    handleSampleText,
    handleCopy,
    handleDownload,
    updateWordCount
  };
};
