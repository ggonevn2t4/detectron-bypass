
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/ui/code-block';

const APIFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <section className="py-20 px-4">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-6">API Documentation</h1>
              <p className="text-xl text-muted-foreground mb-12">
                Tích hợp các tính năng Humanize AI vào ứng dụng của bạn với API đơn giản và mạnh mẽ.
              </p>
              
              <div className="space-y-10">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Tổng quan</h2>
                  <p className="mb-4">
                    API của Humanize AI cho phép bạn tích hợp các tính năng humanize, phát hiện AI, và phân tích văn bản vào ứng dụng của mình.
                    Dưới đây là các endpoint chính và cách sử dụng chúng.
                  </p>
                  
                  <div className="rounded-md bg-muted p-4 mb-4">
                    <p className="text-sm font-medium">Base URL:</p>
                    <code className="block mt-1 text-sm">https://api.humanizer.ai/v1</code>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Tất cả các request yêu cầu xác thực bằng API Key. Liên hệ với chúng tôi để nhận API key.
                  </p>
                </Card>
                
                <Tabs defaultValue="humanize">
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="humanize">Humanize</TabsTrigger>
                    <TabsTrigger value="detect">Detect AI</TabsTrigger>
                    <TabsTrigger value="optimize">Optimize</TabsTrigger>
                    <TabsTrigger value="analyze">Analyze</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="humanize" className="mt-6">
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold mb-3">Humanize Text</h3>
                      <p className="mb-4">
                        Chuyển đổi văn bản được tạo bởi AI thành văn bản viết theo phong cách con người.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Endpoint</h4>
                          <code className="block bg-muted p-2 rounded">POST /humanize</code>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Request Body</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "text": "Your AI-generated text here",
  "options": {
    "targetScore": 95,
    "approach": "standard",
    "style": "academic"
  }
}`}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Response</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "success": true,
  "data": {
    "humanizedText": "Your humanized text result",
    "humanScore": 95
  }
}`}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Ví dụ sử dụng với JavaScript</h4>
                          <pre className="bg-black text-white p-3 rounded overflow-x-auto">
{`fetch('https://api.humanizer.ai/v1/humanize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: "AI generated text to humanize",
    options: {
      targetScore: 95,
      approach: "standard",
      style: "academic"
    }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="detect" className="mt-6">
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold mb-3">Detect AI Text</h3>
                      <p className="mb-4">
                        Phát hiện xem văn bản có được tạo bởi AI hay không và đưa ra điểm số dự đoán.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Endpoint</h4>
                          <code className="block bg-muted p-2 rounded">POST /detect</code>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Request Body</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "text": "Text you want to analyze for AI detection"
}`}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Response</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "success": true,
  "data": {
    "isAI": true,
    "aiScore": 85,
    "details": {
      "aiProbability": 0.85,
      "patterns": [...]
    }
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="optimize" className="mt-6">
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold mb-3">Optimize Humanized Text</h3>
                      <p className="mb-4">
                        Tối ưu hóa văn bản đã humanize để đạt được điểm cao hơn trong việc phát hiện AI.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Endpoint</h4>
                          <code className="block bg-muted p-2 rounded">POST /optimize</code>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Request Body</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "text": "Previously humanized text",
  "currentScore": 85,
  "options": {
    "targetScore": 95,
    "approach": "aggressive",
    "style": "academic"
  }
}`}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Response</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "success": true,
  "data": {
    "optimizedText": "Your further optimized text",
    "newScore": 92
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="analyze" className="mt-6">
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold mb-3">Analyze Text</h3>
                      <p className="mb-4">
                        Phân tích chi tiết về văn bản, bao gồm các thuộc tính như độ phức tạp, độ đa dạng từ vựng, và cấu trúc câu.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Endpoint</h4>
                          <code className="block bg-muted p-2 rounded">POST /analyze</code>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Request Body</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "text": "Text you want to analyze"
}`}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Response</h4>
                          <pre className="bg-muted p-3 rounded overflow-x-auto">
{`{
  "success": true,
  "data": {
    "readability": {
      "fleschKincaid": 75,
      "complexity": "medium"
    },
    "vocabulary": {
      "uniqueWords": 120,
      "diversity": 0.78
    },
    "structure": {
      "averageSentenceLength": 15.2,
      "paragraphCount": 5
    }
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
                  <p className="mb-4">
                    API của chúng tôi có các giới hạn tỷ lệ sau đây:
                  </p>
                  
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Gói</th>
                        <th className="text-left py-2">Số lượng request</th>
                        <th className="text-left py-2">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Free</td>
                        <td className="py-2">100</td>
                        <td className="py-2">Mỗi ngày</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Basic</td>
                        <td className="py-2">1,000</td>
                        <td className="py-2">Mỗi ngày</td>
                      </tr>
                      <tr>
                        <td className="py-2">Professional</td>
                        <td className="py-2">10,000</td>
                        <td className="py-2">Mỗi ngày</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
                
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Support</h2>
                  <p className="mb-4">
                    Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi tại:
                  </p>
                  <a href="mailto:api-support@humanizer.ai" className="text-primary hover:underline">
                    api-support@humanizer.ai
                  </a>
                </Card>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default APIFeature;
