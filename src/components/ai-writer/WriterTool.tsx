
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import WriterInput from './WriterInput';
import WriterOutput from './WriterOutput';
import WriterSettings from './writer/WriterSettings';
import WriterHistory from './writer/WriterHistory';
import { useWriterState } from './writer/useWriterState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WriterTool = () => {
  // Use the custom hook to manage state and actions
  const state = useWriterState();
  const [activeTab, setActiveTab] = useState<string>("editor");
  
  const {
    topic, setTopic,
    length, setLength,
    tone, setTone,
    format, setFormat,
    audience, setAudience,
    includeHeadings, setIncludeHeadings,
    includeFacts, setIncludeFacts,
    includeQuotes, setIncludeQuotes,
    generatedResult,
    isGenerating,
    progressValue,
    handleGenerate,
    handleRegenerateContent,
    handleCopy,
    handleDownload,
    handleSave,
    handleContentEdit,
    handleTitleEdit
  } = state;

  const handleSelectHistoryContent = (item: any) => {
    setTopic(item.topic);
    setLength(item.length as 'short' | 'medium' | 'long');
    setTone(item.tone as 'formal' | 'casual' | 'professional');
    setFormat(item.format as 'article' | 'blog' | 'essay' | 'story' | 'summary');
    setAudience(item.audience as 'general' | 'technical' | 'business' | 'academic');
    
    // Set the generated result manually
    state.setGeneratedResult({
      content: item.content,
      title: item.title,
      estimatedWordCount: item.word_count,
      qualityScore: item.quality_score
    });
    
    // Switch to editor tab
    setActiveTab("editor");
  };

  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="editor">Trình tạo nội dung</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="editor" className="mt-0">
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
                    format={format}
                    setFormat={setFormat}
                    audience={audience}
                    setAudience={setAudience}
                    includeHeadings={includeHeadings}
                    setIncludeHeadings={setIncludeHeadings}
                    includeFacts={includeFacts}
                    setIncludeFacts={setIncludeFacts}
                    includeQuotes={includeQuotes}
                    setIncludeQuotes={setIncludeQuotes}
                    isGenerating={isGenerating}
                    onGenerate={handleGenerate}
                  />
                  
                  <WriterSettings 
                    isGenerating={isGenerating}
                    progressValue={progressValue}
                  />
                  
                  <WriterOutput
                    content={generatedResult?.content || ''}
                    title={generatedResult?.title}
                    estimatedWordCount={generatedResult?.estimatedWordCount}
                    isGenerating={isGenerating}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    contentScore={generatedResult?.qualityScore}
                    onRegenerate={handleRegenerateContent}
                    onSave={handleSave}
                    onContentEdit={handleContentEdit}
                    onTitleEdit={handleTitleEdit}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <WriterHistory onSelectContent={handleSelectHistoryContent} />
          </TabsContent>
        </Tabs>
      </Container>
    </section>
  );
};

export default WriterTool;
