import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/ui/seo";

export function Offline() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleTryAgain = () => {
    if (navigator.onLine) {
      window.location.href = "/";
    } else {
      handleRefresh();
    }
  };

  return (
    <>
      <SEO 
        title="Offline - PathTwo"
        description="You're currently offline. Some content may not be available."
      />
      
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">You're Offline</h1>
            <p className="text-muted-foreground">
              It looks like you've lost your internet connection. Some content may not be available right now.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleTryAgain} 
              className="w-full"
              data-testid="button-try-again"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p>While offline, you can still:</p>
              <ul className="mt-2 space-y-1">
                <li>• Read previously loaded blog posts</li>
                <li>• View cached wealth data</li>
                <li>• Browse your reading history</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/" data-testid="link-home-offline">
                Go to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}