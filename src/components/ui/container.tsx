
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 w-full max-w-[1400px]", className)} {...props}>
      {children}
    </div>
  );
}
