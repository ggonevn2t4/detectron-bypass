import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { saveAs } from 'file-saver';

// CSV Export Function
export const exportToCSV = (result: AIDetectionResult) => {
  // Format patterns for CSV
  const formattedPatterns = result.patterns
    .map(p => `${p.pattern}: ${p.description}`)
    .join('; ');

  const csvData = [
    ["Score", "Confidence", "Analysis", "Patterns", "Suggestions"],
    [
      result.score,
      result.confidence,
      result.analysis,
      formattedPatterns,
      result.suggestions.join('; ')
    ]
  ];

  const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ai_analysis.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
  document.body.removeChild(link);
}

// PDF Export Function
export const exportToPDF = (result: AIDetectionResult) => {
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: 'AI Analysis Report',
    subject: 'Detailed AI analysis of the provided text',
    author: 'AI Humanizer',
    keywords: 'AI, analysis, report, text'
  });

  let currentY = 20; // Initial Y position

  // Function to add text with auto-wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
    const fontSize = 12;
    const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;

    let textLines = doc.splitTextToSize(text, maxWidth);
    doc.setFontSize(fontSize);
    textLines.forEach(line => {
      doc.text(line, x, y);
      y += lineHeight;
    });
    return y;
  };

  // Title
  doc.setFontSize(24);
  doc.setTextColor(40);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Analysis Report', 20, currentY);
  currentY += 20;

  // Analysis Summary
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Summary:', 20, currentY);
  currentY += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`AI Score: ${result.score}`, 20, currentY);
  currentY += 8;
  doc.text(`Confidence: ${result.confidence}`, 20, currentY);
  currentY += 10;

  // Detailed Analysis
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Analysis:', 20, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  currentY = addWrappedText(result.analysis, 20, currentY, 170);
  currentY += 10;

  // Add patterns section
  doc.text('Identified AI Patterns:', 20, currentY);
  currentY += 10;

  result.patterns.forEach((pattern, index) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${pattern.pattern}`, 25, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.text(pattern.description, 30, currentY);
    currentY += 8;

    if (pattern.examples && pattern.examples.length > 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Examples:', 30, currentY);
      currentY += 6;

      pattern.examples.forEach(example => {
        doc.text(`- ${example}`, 35, currentY);
        currentY += 6;
      });
    }

    currentY += 4;
  });

  // Suggestions
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Suggestions for Improvement:', 20, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  result.suggestions.forEach((suggestion, index) => {
    doc.text(`${index + 1}. ${suggestion}`, 25, currentY);
    currentY += 6;
  });

  // Save the PDF
  doc.save('ai_analysis_report.pdf');
};
