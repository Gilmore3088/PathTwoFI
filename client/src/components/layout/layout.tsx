import { Header } from "./header";
import { Footer } from "./footer";
// import { ThemeProvider } from "@/components/ui/theme-provider"; // Temporarily disabled due to React version conflict

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
