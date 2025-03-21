
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  language?: string;
  className?: string;
  children: React.ReactNode;
}

export const CodeBlock = ({
  language = 'javascript',
  className,
  children,
}: CodeBlockProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    if (typeof children !== 'string') return;
    
    navigator.clipboard.writeText(children);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-md"
          onClick={copyCode}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="bg-black text-white p-4 rounded-md overflow-x-auto">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
};
