
import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface SocialSharingProps {
  title: string;
  score: number | null;
  onCopy: () => void;
  copied: boolean;
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  title,
  score,
  onCopy,
  copied
}) => {
  if (score === null) return null;

  const urlToShare = window.location.href;
  const textToShare = `${title} - Tôi đã phân tích văn bản và có điểm AI là ${score}%. Hãy thử ngay!`;

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}&quote=${encodeURIComponent(textToShare)}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(urlToShare)}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlToShare)}`,
      '_blank'
    );
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${textToShare}\n\n${urlToShare}`)}`,
      '_blank'
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 items-center mt-2">
        <div className="flex-grow text-sm font-medium text-muted-foreground">
          Chia sẻ kết quả:
        </div>
        <div className="flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={shareOnFacebook} 
                variant="outline" 
                size="sm" 
                className="rounded-full h-9 w-9 p-0"
              >
                <span className="sr-only">Chia sẻ lên Facebook</span>
                <Facebook className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chia sẻ lên Facebook</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={shareOnTwitter} 
                variant="outline" 
                size="sm" 
                className="rounded-full h-9 w-9 p-0"
              >
                <span className="sr-only">Chia sẻ lên Twitter</span>
                <Twitter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chia sẻ lên Twitter</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={shareOnLinkedIn} 
                variant="outline" 
                size="sm" 
                className="rounded-full h-9 w-9 p-0"
              >
                <span className="sr-only">Chia sẻ lên LinkedIn</span>
                <Linkedin className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chia sẻ lên LinkedIn</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={shareViaEmail} 
                variant="outline" 
                size="sm" 
                className="rounded-full h-9 w-9 p-0"
              >
                <span className="sr-only">Chia sẻ qua Email</span>
                <Mail className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chia sẻ qua Email</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onCopy} 
                variant="outline" 
                size="sm" 
                className={cn("rounded-full h-9 w-9 p-0", copied ? "bg-green-50 border-green-200" : "")}
              >
                <span className="sr-only">Sao chép link</span>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Đã sao chép" : "Sao chép link"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SocialSharing;
