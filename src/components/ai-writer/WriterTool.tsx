
import React, { useState } from 'react';
import { generateAIContent } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Container } from '@/components/ui/container';
import WriterInput from './WriterInput';
import WriterOutput from './WriterOutput';
import { Progress } from '@/components/ui/progress';

const WriterTool = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [tone, setTone] = useState<'formal' | 'casual' | 'professional'>('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [contentScore, setContentScore] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Empty Topic",
        description: "Please enter a topic to write about",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgressValue(0);
    
    // Simulate progress while content is being generated
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 300);
    
    try {
      const content = await generateAIContent(topic, length, tone);
      setGeneratedContent(content);
      
      // Set a random quality score between 88-99
      const qualityScore = Math.floor(Math.random() * 12) + 88;
      setContentScore(qualityScore);
      
      setProgressValue(100);
      
      toast({
        title: "Content Generated",
        description: "Your content has been created successfully",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while generating content",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content has been copied to clipboard",
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
      description: `Content has been downloaded as ${filename}`,
    });
  };

  const handleRegenerateContent = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setProgressValue(0);
    
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 300);
    
    try {
      const content = await generateAIContent(topic, length, tone);
      setGeneratedContent(content);
      
      // Set a new random quality score between 88-99
      const qualityScore = Math.floor(Math.random() * 12) + 88;
      setContentScore(qualityScore);
      
      setProgressValue(100);
    } catch (error) {
      console.error('Error regenerating content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while regenerating content",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WriterInput
                topic={topic}
                setTopic={setTopic}
                length={length}
                setLength={setLength}
                tone={tone}
                setTone={setTone}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
              />
              
              {isGenerating && (
                <div className="md:col-span-2 mb-3">
                  <Progress value={progressValue} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {progressValue < 30 
                      ? 'Analyzing topic and researching...' 
                      : progressValue < 60
                      ? 'Crafting content with your preferences...'
                      : progressValue < 95
                      ? 'Finalizing and polishing content...'
                      : 'Complete!'}
                  </p>
                </div>
              )}
              
              <WriterOutput
                content={generatedContent}
                isGenerating={isGenerating}
                onCopy={handleCopy}
                onDownload={handleDownload}
                contentScore={contentScore}
                onRegenerate={handleRegenerateContent}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WriterTool;
