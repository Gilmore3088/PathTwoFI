import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileOptimizedButtonProps extends ButtonProps {
  touchFeedback?: boolean;
  largeTouch?: boolean;
}

export const MobileOptimizedButton = React.forwardRef<
  HTMLButtonElement,
  MobileOptimizedButtonProps
>(({ className, touchFeedback = true, largeTouch = false, children, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <Button
      ref={ref}
      className={cn(
        // Base touch-friendly styles
        "select-none",
        
        // Mobile-specific optimizations
        isMobile && [
          "min-h-[44px] min-w-[44px]", // Minimum touch target
          largeTouch && "min-h-[48px] min-w-[48px] px-6 py-3", // Larger for primary actions
        ],
        
        // Touch feedback
        touchFeedback && [
          "touch-feedback",
          "transition-transform duration-100 ease-out",
          "active:scale-[0.98]",
          "active:transition-none",
        ],
        
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

MobileOptimizedButton.displayName = "MobileOptimizedButton";