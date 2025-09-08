import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminHome from "@/pages/admin-home";
import AdminWealth from "@/pages/admin-wealth";
import AdminBlog from "@/pages/admin-blog";
import AdminGoals from "@/pages/admin-goals";
import NotFound from "@/pages/not-found";
import { Offline } from "@/pages/offline";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={AdminHome} />
      <Route path="/admin/wealth" component={AdminWealth} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/goals" component={AdminGoals} />
      <Route path="/offline" component={Offline} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log("📍 App component rendering...");
  
  try {
    console.log("📍 Initializing providers and layout...");
    return (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Layout>
              <Router />
            </Layout>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );
  } catch (error) {
    console.error("❌ Error in App component:", error);
    return <div>App Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }
}

export default App;
