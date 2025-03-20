
import React, { useState } from 'react';
import { generateAIContent } from '@/services/ai';
import { toast } from '@/components/ui/use-toast';
import { Container } from '@/components/ui/container';
import WriterInput from './WriterInput';
import WriterOutput from './WriterOutput';

const WriterTool = () => {
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [tone, setTone] = useState<'formal' | 'casual' | 'professional'>('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
    try {
      const content = await generateAIContent(topic, length, tone);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while generating content",
        variant: "destructive",
      });
    } finally {
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
              <WriterOutput
                content={generatedContent}
                isGenerating={isGenerating}
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

export default WriterTool;
