
import { AIGenerationResult } from '@/services/ai';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface NavigationActionsProps {
  generatedResult: AIGenerationResult | null;
}

export const useNavigationActions = ({
  generatedResult
}: NavigationActionsProps) => {
  const navigate = useNavigate();

  const handleSendToHumanizer = () => {
    if (!generatedResult) {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để gửi đến Humanizer",
        variant: "destructive",
      });
      return;
    }

    // Store content in localStorage to pass between tools
    localStorage.setItem('humanizer_input', generatedResult.content);
    
    // Navigate to the humanizer tool
    navigate('/');
    
    // Show notification
    toast({
      title: "Đã chuyển sang Humanizer",
      description: "Nội dung đã được chuyển đến công cụ Humanizer",
    });
    
    // Select the humanizer tab
    setTimeout(() => {
      const humanizerTab = document.querySelector('[data-value="humanizer"]') as HTMLElement;
      if (humanizerTab) {
        humanizerTab.click();
      }
    }, 100);
  };

  const handleSendToDetector = () => {
    if (!generatedResult) {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để kiểm tra",
        variant: "destructive",
      });
      return;
    }

    // Store content in localStorage to pass between tools
    localStorage.setItem('detector_input', generatedResult.content);
    
    // Navigate to the detector tool
    navigate('/');
    
    // Show notification
    toast({
      title: "Đã chuyển sang AI Detector",
      description: "Nội dung đã được chuyển đến công cụ AI Detector",
    });
    
    // Select the detector tab
    setTimeout(() => {
      const detectorTab = document.querySelector('[data-value="detector"]') as HTMLElement;
      if (detectorTab) {
        detectorTab.click();
      }
    }, 100);
  };

  return {
    handleSendToHumanizer,
    handleSendToDetector
  };
};
