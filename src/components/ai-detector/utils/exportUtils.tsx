
import { jsPDF } from 'jspdf';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';

// Format detection result for CSV export
export const formatResultForCSV = (
  score: number | null,
  confidence: string,
  analysis: string,
  patterns: string[] = [],
  suggestions: string[] = []
): string => {
  // Escape quotes and special characters in text fields
  const escapeCSV = (text: string) => `"${text.replace(/"/g, '""')}"`;
  
  // Create CSV header
  let csv = 'Score,Confidence,Analysis,Patterns,Suggestions\n';
  
  // Create CSV row with content
  csv += [
    score !== null ? score : '',
    escapeCSV(confidence),
    escapeCSV(analysis),
    escapeCSV(patterns.join('; ')),
    escapeCSV(suggestions.join('; '))
  ].join(',');
  
  return csv;
};

// Export result as CSV file
export const exportAsCSV = (result: AIDetectionResult, filename: string = 'ai-detection-results.csv') => {
  const csv = formatResultForCSV(
    result.score,
    result.confidence,
    result.analysis,
    result.patterns,
    result.suggestions
  );
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export result as PDF
export const exportAsPDF = (result: AIDetectionResult, filename: string = 'ai-detection-results.pdf') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('AI Detection Results', 20, 20);
  
  // Add score and confidence
  doc.setFontSize(14);
  doc.text(`Score: ${result.score}%`, 20, 35);
  doc.text(`Confidence: ${result.confidence}`, 20, 45);
  
  // Add analysis
  doc.setFontSize(12);
  doc.text('Analysis:', 20, 60);
  
  // Handle text wrapping for analysis
  const splitAnalysis = doc.splitTextToSize(result.analysis, 170);
  doc.text(splitAnalysis, 20, 70);
  
  let yPos = 70 + (splitAnalysis.length * 6);
  
  // Add patterns if they exist
  if (result.patterns && result.patterns.length > 0) {
    doc.text('Detected Patterns:', 20, yPos + 10);
    yPos += 15;
    
    result.patterns.forEach((pattern, index) => {
      const splitPattern = doc.splitTextToSize(`- ${pattern}`, 170);
      doc.text(splitPattern, 20, yPos);
      yPos += splitPattern.length * 6;
    });
  }
  
  // Add suggestions if they exist
  if (result.suggestions && result.suggestions.length > 0) {
    doc.text('Suggestions:', 20, yPos + 10);
    yPos += 15;
    
    result.suggestions.forEach((suggestion, index) => {
      const splitSuggestion = doc.splitTextToSize(`- ${suggestion}`, 170);
      doc.text(splitSuggestion, 20, yPos);
      yPos += splitSuggestion.length * 6;
    });
  }
  
  // Add footer with timestamp
  const timestamp = new Date().toLocaleString('vi-VN');
  doc.setFontSize(10);
  doc.text(`Exported on: ${timestamp}`, 20, 285);
  
  // Save PDF
  doc.save(filename);
};

// Export history analytics as CSV
export const exportHistoryAsCSV = (history: any[], filename: string = 'ai-detection-history.csv') => {
  if (!history || history.length === 0) return;
  
  // CSV header
  let csv = 'Date,Text,Score,Confidence,Analysis\n';
  
  // Add each history item as a row
  history.forEach(item => {
    const date = new Date(item.date).toLocaleString('vi-VN');
    const row = [
      `"${date}"`,
      `"${item.text.replace(/"/g, '""')}"`,
      item.result.score,
      `"${item.result.confidence}"`,
      `"${item.result.analysis.replace(/"/g, '""')}"`
    ].join(',');
    
    csv += row + '\n';
  });
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
