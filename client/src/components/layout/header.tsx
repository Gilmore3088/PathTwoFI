import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MobileOptimizedButton } from "@/components/ui/mobile-optimized-button";
import { useTheme } from "@/components/ui/theme-provider";
import { Mountain, Moon, Sun, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTouchGestures } from "@/hooks/use-touch";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/dashboard", label: "Wealth Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Add swipe gesture support for mobile navigation
  const headerRef = useTouchGestures({
    onSwipeLeft: () => {
      // Close mobile menu on swipe left
      setIsSheetOpen(false);
    },
    onSwipeRight: () => {
      // Open mobile menu on swipe right from edge
      if (window.innerWidth < 768) {
        setIsSheetOpen(true);
      }
    },
    threshold: 100
  });

  return (
    <header 
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center space-x-2">
                <Mountain className="text-primary text-xl" data-testid="icon-logo" />
                <span className="font-bold text-xl text-foreground">PathTwo</span>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}>
                <span className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
                  location === item.href && "text-foreground font-medium"
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <MobileOptimizedButton
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              touchFeedback={true}
              data-testid="button-theme-toggle"
              className="h-10 w-10"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </MobileOptimizedButton>
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <MobileOptimizedButton 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-10 w-10" 
                  data-testid="button-mobile-menu"
                  touchFeedback={true}
                  largeTouch={true}
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </MobileOptimizedButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-2 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <div className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors text-lg cursor-pointer p-3 rounded-lg hover:bg-accent/50 min-h-[48px] flex items-center touch-feedback",
                        location === item.href && "text-foreground font-medium bg-accent/20"
                      )}>
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
