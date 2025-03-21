
import React from 'react';
import { Container } from '@/components/ui/container';
import WriterInput from './WriterInput';
import WriterOutput from './WriterOutput';
import WriterSettings from './writer/WriterSettings';
import { useWriterState } from './writer/useWriterState';

const WriterTool = () => {
  // Use the custom hook to manage state and actions
  const state = useWriterState();
  
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
    handleSave
  } = state;

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
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WriterTool;
