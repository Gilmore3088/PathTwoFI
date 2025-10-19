import { Mountain, Twitter, Mail } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="py-12 lg:py-16 bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Mountain className="text-primary text-xl" data-testid="icon-footer-logo" />
                <span className="font-bold text-xl text-foreground">PathTwo</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Tracking our combined journey to financial independence through data-driven wealth tracking and transparent reporting.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-social-twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-social-email"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Content</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-blog"
                  >
                    Blog Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-dashboard"
                  >
                    Wealth Dashboard
                  </Link>
                </li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-updates">Monthly Updates</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-strategy">Investment Strategy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-about"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-contact"
                  >
                    Contact
                  </Link>
                </li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 PathTwo. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Built with passion for financial independence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
