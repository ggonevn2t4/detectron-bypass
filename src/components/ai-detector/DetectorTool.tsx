
import React, { useState, useEffect } from 'react';
import { detectAIContent } from '@/services/ai';
import { toast } from '@/components/ui/use-toast';
import { Container } from '@/components/ui/container';
import DetectorInput from './DetectorInput';
import DetectorOutput from './DetectorOutput';
import { sampleTexts } from '../humanizer/SampleTexts';

const DetectorTool = () => {
  const [inputText, setInputText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('medium');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateWordCount(text);
    // Reset results when input changes
    setScore(null);
    setAnalysis('');
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

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await detectAIContent(inputText);
      setScore(result.score);
      setAnalysis(result.analysis);
      setConfidence(result.confidence);
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while analyzing the text",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Analysis has been copied to clipboard",
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
      title: "Downloaded",
      description: `Analysis has been downloaded as ${filename}`,
    });
  };

  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetectorInput
                inputText={inputText}
                wordCount={wordCount}
                isProcessing={isProcessing}
                onInputChange={handleInputChange}
                onSampleText={handleSampleText}
                onAnalyze={handleAnalyze}
              />
              <DetectorOutput
                score={score}
                analysis={analysis}
                confidence={confidence}
                isProcessing={isProcessing}
                onCopy={handleCopy}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DetectorTool;
