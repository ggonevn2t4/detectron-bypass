
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import DetectorInput from './DetectorInput';
import DetectorOutput from './DetectorOutput';
import { sampleTexts } from '../humanizer/SampleTexts';
import { sampleContents } from './SampleContents';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDetectorState } from './hooks/useDetectorState';
import { useDetectorActions } from './hooks/useDetectorActions';
import { formatAnalysisText } from './utils/formatUtils';
import DetectorHistory from './DetectorHistory';
import HistoryToggle from './HistoryToggle';
import DetectionAnalytics from './DetectionAnalytics';
import ErrorAlert from '@/components/ui/error-alert';
import { Loader2 } from 'lucide-react';

const DetectorTool = () => {
  const isMobile = useIsMobile();
  const [error, setError] = useState<string | null>(null);
  
  const {
    inputText,
    setInputText,
    wordCount,
    setWordCount,
    isProcessing,
    setIsProcessing,
    detectionResult,
    setDetectionResult,
    history,
    setHistory,
    showHistory,
    setShowHistory,
    toast
  } = useDetectorState();
  
  const {
    handleInputChange,
    handleSampleText,
    handleSampleContent,
    handleAnalyze,
    handleCopy,
    handleShareCopy,
    handleDownload,
    handleExportCSV,
    handleExportPDF,
    handleHistoryItemClick,
    handleClearHistory,
    copied
  } = useDetectorActions({
    inputText,
    setInputText,
    setWordCount,
    setIsProcessing,
    setDetectionResult,
    history,
    setHistory,
    setShowHistory,
    toast,
    setError
  });

  const handleSampleTextClick = (category?: string) => {
    // Filter by category if provided, otherwise use all samples
    const filteredSamples = category 
      ? sampleTexts.filter(sample => sample.category === category)
      : sampleTexts;
    
    // Get a random sample from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredSamples.length);
    const selectedSample = filteredSamples[randomIndex];
    
    // Clear any previous errors
    setError(null);
    
    // Use the content of the selected sample
    handleSampleText(selectedSample.content);
  };

  const handleToggleHistory = () => {
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleCopyResult = () => {
    if (detectionResult) {
      const fullAnalysis = formatAnalysisText(
        detectionResult.score,
        detectionResult.confidence,
        detectionResult.analysis,
        detectionResult.patterns,
        detectionResult.suggestions
      );
      handleCopy(fullAnalysis);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (inputText.trim()) {
      handleAnalyze();
    }
  };

  return (
    <section className="py-10 px-4 sm:px-6 bg-background">
      <Container>
        {error && (
          <ErrorAlert 
            message={error} 
            retry={handleRetry} 
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History Sidebar */}
          {history.length > 0 && (
            <DetectorHistory
              history={history}
              showHistory={showHistory || !isMobile}
              isMobile={isMobile}
              onHistoryItemClick={(item) => handleHistoryItemClick(item, isMobile)}
              onClearHistory={handleClearHistory}
              onCloseHistory={handleCloseHistory}
            />
          )}

          {/* Main Content */}
          <div className={`${isMobile || !history.length ? 'col-span-1 lg:col-span-3' : 'col-span-1 lg:col-span-2'}`}>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Mobile History Toggle */}
              {isMobile && history.length > 0 && !showHistory && (
                <HistoryToggle
                  historyCount={history.length}
                  onToggleHistory={handleToggleHistory}
                />
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Đang phân tích văn bản...</p>
                </div>
              )}

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <DetectorInput
                    inputText={inputText}
                    wordCount={wordCount}
                    isProcessing={isProcessing}
                    onInputChange={handleInputChange}
                    onSampleText={handleSampleTextClick}
                    onSampleContent={handleSampleContent}
                    onAnalyze={handleAnalyze}
                    sampleContents={sampleContents}
                    sampleTexts={sampleTexts}
                  />
                  <DetectorOutput
                    score={detectionResult?.score ?? null}
                    analysis={detectionResult?.analysis ?? ''}
                    confidence={detectionResult?.confidence ?? 'medium'}
                    patterns={detectionResult?.patterns}
                    suggestions={detectionResult?.suggestions}
                    isProcessing={isProcessing}
                    onCopy={handleCopyResult}
                    onDownload={(text) => handleDownload(text, 'ai-analysis.txt')}
                    onExportCSV={() => detectionResult && handleExportCSV(detectionResult)}
                    onExportPDF={() => detectionResult && handleExportPDF(detectionResult)}
                    copied={copied}
                  />
                </div>
              </div>
            </div>
            
            {/* Analytics Dashboard */}
            {history.length > 0 && (
              <DetectionAnalytics history={history} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DetectorTool;
