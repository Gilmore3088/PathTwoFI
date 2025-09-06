import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Mountain, Moon, Sun, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/dashboard", label: "Wealth Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="link-home">
              <a className="flex items-center space-x-2">
                <Mountain className="text-primary text-xl" data-testid="icon-logo" />
                <span className="font-bold text-xl text-foreground">The FIRE Journey</span>
              </a>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}>
                <a className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors",
                  location === item.href && "text-foreground font-medium"
                )}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}>
                      <a className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors text-lg",
                        location === item.href && "text-foreground font-medium"
                      )}>
                        {item.label}
                      </a>
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
