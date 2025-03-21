
import React from 'react';
import HumanizerTabContent from '@/components/humanizer/HumanizerTabContent';
import { useHumanizer } from '@/hooks/useHumanizer';

const HumanizerTab = () => {
  const {
    inputText,
    outputText,
    isProcessing,
    wordCount,
    humanScore,
    progressValue,
    showAdvancedSettings,
    humanScoreTarget,
    humanizationApproach,
    autoOptimize,
    iterations,
    writingStyle,
    handleInputChange,
    handleSampleText,
    handleHumanize,
    handleOptimize,
    handleCopy,
    handleDownload,
    setShowAdvancedSettings,
    setHumanScoreTarget,
    setHumanizationApproach,
    setAutoOptimize,
    setIterations,
    setWritingStyle
  } = useHumanizer();

  return (
    <HumanizerTabContent
      inputText={inputText}
      outputText={outputText}
      wordCount={wordCount}
      isProcessing={isProcessing}
      showAdvancedSettings={showAdvancedSettings}
      humanScore={humanScore}
      progressValue={progressValue}
      humanScoreTarget={humanScoreTarget}
      humanizationApproach={humanizationApproach}
      autoOptimize={autoOptimize}
      iterations={iterations}
      writingStyle={writingStyle}
      onInputChange={handleInputChange}
      onSampleText={handleSampleText}
      onToggleSettings={() => setShowAdvancedSettings(!showAdvancedSettings)}
      onHumanize={handleHumanize}
      onOptimize={handleOptimize}
      onCopy={handleCopy}
      onDownload={handleDownload}
      setHumanScoreTarget={setHumanScoreTarget}
      setHumanizationApproach={setHumanizationApproach}
      setAutoOptimize={setAutoOptimize}
      setIterations={setIterations}
      setWritingStyle={setWritingStyle}
    />
  );
};

export default HumanizerTab;
