
import React from 'react';
import { Container } from '@/components/ui/container';
import WriterInput from './WriterInput';
import WriterOutput from './WriterOutput';
import WriterSettings from './writer/WriterSettings';
import { useWriterState } from './writer/useWriterState';
import { useWriterActions } from './writer/useWriterActions';

const WriterTool = () => {
  // Use the custom hooks to manage state and actions
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
    toast
  } = state;
  
  const actions = useWriterActions({
    ...state,
    setGeneratedResult: state.setGeneratedResult,
    setIsGenerating: state.setIsGenerating,
    setProgressValue: state.setProgressValue,
    toast
  });

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
                onGenerate={actions.handleGenerate}
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
                onCopy={actions.handleCopy}
                onDownload={actions.handleDownload}
                contentScore={generatedResult?.qualityScore}
                onRegenerate={actions.handleRegenerateContent}
                onSave={actions.handleSave}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WriterTool;
