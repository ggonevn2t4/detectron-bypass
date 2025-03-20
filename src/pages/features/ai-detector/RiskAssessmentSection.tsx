
import React from 'react';
import { Container } from '@/components/ui/container';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const RiskAssessmentSection = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-background rounded-2xl shadow-md border border-border/40 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-2xl font-semibold">Content Risk Assessment</h3>
            </div>

            <p className="mb-6">Our AI detection tool categorizes content into risk levels to help you understand the likelihood of being flagged:</p>

            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-red-700">High Risk (80-100%)</h4>
                  <p className="text-red-600">Content will almost certainly be flagged as AI-generated. Immediate humanization recommended.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-700">Medium Risk (40-79%)</h4>
                  <p className="text-amber-600">Content might be flagged by some detection tools. Targeted revisions recommended for highlighted sections.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-green-700">Low Risk (0-39%)</h4>
                  <p className="text-green-600">Content likely to pass as human-written. Minor improvements may still be suggested for complete safety.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RiskAssessmentSection;
