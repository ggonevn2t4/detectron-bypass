
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { humanizeText, optimizeText, runOptimizationIterations, HumanizationOptions } from '@/components/humanizer/HumanizationEngine';
import { sampleTexts } from '@/components/humanizer/SampleTexts';

interface OptimizationHistoryItem {
  score: number;
  text: string;
}

export const useHumanizer = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [aiDetectionScore, setAiDetectionScore] = useState<number | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [usingRealAI, setUsingRealAI] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const [humanScoreTarget, setHumanScoreTarget] = useState(95);
  const [humanizationApproach, setHumanizationApproach] = useState<'standard' | 'aggressive' | 'ultra'>('standard');
  const [iterations, setIterations] = useState(1);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [writingStyle, setWritingStyle] = useState('general');
  const [optimizationStage, setOptimizationStage] = useState(0);
  const [optimizationHistory, setOptimizationHistory] = useState<Array<OptimizationHistoryItem>>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateWordCount(text);
  };

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleSampleText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setInputText(sampleTexts[randomIndex]);
    updateWordCount(sampleTexts[randomIndex]);
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to humanize",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const options: HumanizationOptions = {
        targetScore: humanScoreTarget,
        approach: humanizationApproach,
        style: writingStyle
      };
      
      const result = await humanizeText(
        inputText,
        usingRealAI,
        options,
        setProgressValue,
        setOptimizationStage,
        setOptimizationHistory,
        setOutputText,
        setHumanScore,
        setAiDetectionScore
      );
      
      if (autoOptimize && result.score < humanScoreTarget && iterations > 1) {
        await runOptimizationIterations(
          result.humanized,
          result.score,
          iterations - 1,
          humanScoreTarget,
          usingRealAI,
          {
            ...options,
            iterationCount: optimizationStage + 1
          },
          setOptimizationStage,
          setOptimizationHistory,
          setOutputText,
          setHumanScore,
          setProgressValue
        );
      } else {
        toast({
          title: "Humanization Complete",
          description: `Your text is now ${result.score}% human-like`,
        });
      }
    } catch (error) {
      console.error("Error in humanization process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimize = async () => {
    if (!outputText.trim()) {
      toast({
        title: "No Text to Optimize",
        description: "Please humanize text first before optimizing",
        variant: "default",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const currentScore = humanScore || 0;
      
      const options: HumanizationOptions = {
        targetScore: humanScoreTarget,
        approach: humanizationApproach,
        style: writingStyle,
        iterationCount: optimizationStage + 1
      };
      
      const result = await optimizeText(
        outputText,
        currentScore,
        usingRealAI,
        options,
        setProgressValue,
        setOptimizationStage,
        setOptimizationHistory,
        setOutputText,
        setHumanScore
      );
      
      toast({
        title: "Optimization Complete",
        description: `Your text is now ${result.score}% human-like`,
      });
    } catch (error) {
      console.error("Error in optimization process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

  useEffect(() => {
    if (inputText !== "") {
      setHumanScore(null);
      setAiDetectionScore(null);
      setOptimizationHistory([]);
      setOptimizationStage(0);
    }
  }, [inputText]);

  return {
    inputText,
    outputText,
    isProcessing,
    wordCount,
    humanScore,
    aiDetectionScore,
    progressValue,
    usingRealAI,
    showAdvancedSettings,
    humanScoreTarget,
    humanizationApproach,
    iterations,
    autoOptimize,
    writingStyle,
    optimizationStage,
    optimizationHistory,
    handleInputChange,
    handleSampleText,
    handleHumanize,
    handleOptimize,
    handleCopy,
    handleDownload,
    setUsingRealAI,
    setShowAdvancedSettings,
    setHumanScoreTarget,
    setHumanizationApproach,
    setIterations,
    setAutoOptimize,
    setWritingStyle
  };
};
