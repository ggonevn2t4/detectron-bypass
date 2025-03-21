
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from './humanizer/HeroSection';
import HowItWorksSection from './humanizer/HowItWorksSection';
import AdvancedFeaturesSection from './humanizer/AdvancedFeaturesSection';
import CTASection from './humanizer/CTASection';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { ArrowRight, Code } from 'lucide-react';

const APISection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">API cho nhà phát triển</h2>
            <p className="text-muted-foreground mb-6">
              Tích hợp các tính năng Humanize AI vào ứng dụng của bạn với API mạnh mẽ và dễ sử dụng.
              Xây dựng các trải nghiệm tùy chỉnh với khả năng humanize văn bản, phát hiện nội dung AI,
              và phân tích văn bản.
            </p>
            <Link 
              to="/features/api"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Xem tài liệu API <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl rounded-xl"></div>
              <div className="relative bg-background border border-border/60 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">API Example</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <pre className="text-xs bg-black text-white p-3 rounded overflow-x-auto">
{`fetch('https://api.humanizer.ai/v1/humanize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer API_KEY'
  },
  body: JSON.stringify({
    text: "AI generated text to humanize"
  })
})
.then(response => response.json())`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

const HumanizerFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <HowItWorksSection />
        <AdvancedFeaturesSection />
        <APISection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HumanizerFeature;
