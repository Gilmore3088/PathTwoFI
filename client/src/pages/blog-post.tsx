import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SEO } from "@/components/ui/seo";
import { ArrowLeft, Clock, Eye, Calendar, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts", slug],
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Post URL has been copied to your clipboard.",
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Wealth Progress":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "FIRE Strategy":
        return "bg-secondary/10 text-secondary hover:bg-secondary/20";
      case "Investments":
        return "bg-secondary/10 text-secondary hover:bg-secondary/20";
      case "Personal Reflections":
        return "bg-accent/10 text-accent hover:bg-accent/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <>
        <SEO 
          title="Loading..."
          description="Loading blog post..."
          type="article"
        />
        <div className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
                <div className="h-12 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                <div className="h-64 bg-muted rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <SEO 
          title="Post Not Found"
          description="The blog post you're looking for doesn't exist or has been moved."
        />
        <div className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-error-title">
                Post Not Found
              </h1>
              <p className="text-muted-foreground mb-8" data-testid="text-error-message">
                The blog post you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild data-testid="button-back-to-blog">
                <Link href="/blog">
                  <a className="inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category}, FIRE, personal finance, wealth tracking, financial independence`}
        type="article"
        url={`/blog/${post.slug}`}
        author="PathTwo"
        publishedTime={new Date(post.createdAt!).toISOString()}
        modifiedTime={post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.createdAt!).toISOString()}
        category={post.category}
        image={post.imageUrl}
      />
      <article className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-8" data-testid="button-back-to-blog">
              <Link href="/blog">
                <span className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </span>
              </Link>
            </Button>

            {/* Post Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  variant="secondary" 
                  className={getCategoryColor(post.category)}
                  data-testid="badge-post-category"
                >
                  {post.category}
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight" data-testid="text-post-title">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center" data-testid="text-post-date">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(post.createdAt!)}
                </div>
                <div className="flex items-center" data-testid="text-post-read-time">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime} min read
                </div>
                <div className="flex items-center" data-testid="text-post-views">
                  <Eye className="w-4 h-4 mr-2" />
                  {post.views?.toLocaleString()} views
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center"
                  data-testid="button-share-post"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-post-excerpt">
                {post.excerpt}
              </p>
            </header>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="mb-8">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                  data-testid="img-post-featured"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none" data-testid="content-post-body">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Post Footer */}
            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground" data-testid="text-post-footer">
                  Thank you for reading! Follow along for more updates on the journey to financial independence.
                </p>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center"
                  data-testid="button-share-post-footer"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share this post
                </Button>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </>
  );
}