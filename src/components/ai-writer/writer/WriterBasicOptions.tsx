
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface WriterBasicOptionsProps {
  length: 'short' | 'medium' | 'long';
  setLength: (length: 'short' | 'medium' | 'long') => void;
  tone: 'formal' | 'casual' | 'professional';
  setTone: (tone: 'formal' | 'casual' | 'professional') => void;
}

const WriterBasicOptions: React.FC<WriterBasicOptionsProps> = ({
  length,
  setLength,
  tone,
  setTone
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/10 p-4 rounded-lg border border-border/40">
      <div className="space-y-2">
        <Label className="block font-medium">Độ dài nội dung</Label>
        <RadioGroup value={length} onValueChange={(value: 'short' | 'medium' | 'long') => setLength(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="short" id="length-short" />
            <Label htmlFor="length-short" className="cursor-pointer">Ngắn (250-350 từ)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="length-medium" />
            <Label htmlFor="length-medium" className="cursor-pointer">Trung bình (500-700 từ)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="long" id="length-long" />
            <Label htmlFor="length-long" className="cursor-pointer">Dài (900-1500 từ)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label className="block font-medium">Giọng điệu</Label>
        <RadioGroup value={tone} onValueChange={(value: 'formal' | 'casual' | 'professional') => setTone(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="formal" id="tone-formal" />
            <Label htmlFor="tone-formal" className="cursor-pointer">Trang trọng/Học thuật</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="casual" id="tone-casual" />
            <Label htmlFor="tone-casual" className="cursor-pointer">Thân thiện/Trò chuyện</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="professional" id="tone-professional" />
            <Label htmlFor="tone-professional" className="cursor-pointer">Chuyên nghiệp/Doanh nghiệp</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default WriterBasicOptions;
