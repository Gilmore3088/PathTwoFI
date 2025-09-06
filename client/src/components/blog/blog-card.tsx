import { BlogPost } from "@shared/schema";
import { Link } from "wouter";
import { Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/ui/lazy-image";

interface BlogCardProps {
  post: BlogPost;
  size?: "default" | "compact";
}

export function BlogCard({ post, size = "default" }: BlogCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short',
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

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow" data-testid={`article-blog-${post.slug}`}>
      {post.imageUrl && (
        <LazyImage 
          src={post.imageUrl} 
          alt={post.title}
          className={`w-full object-cover ${size === "compact" ? "h-32" : "h-40"}`}
          data-testid={`img-blog-${post.slug}`}
        />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className={getCategoryColor(post.category)}
            data-testid={`badge-category-${post.slug}`}
          >
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground" data-testid={`text-date-${post.slug}`}>
            {formatDate(post.createdAt!)}
          </span>
        </div>
        <h3 className={`font-semibold text-foreground mb-2 hover:text-primary transition-colors ${size === "compact" ? "text-base" : "text-lg"}`}>
          <Link href={`/blog/${post.slug}`} data-testid={`link-blog-${post.slug}`}>
            <span>{post.title}</span>
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-4" data-testid={`text-excerpt-${post.slug}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center" data-testid={`text-read-time-${post.slug}`}>
            <Clock className="w-3 h-3 mr-1" />
            {post.readTime} min read
          </span>
          <span className="flex items-center" data-testid={`text-views-${post.slug}`}>
            <Eye className="w-3 h-3 mr-1" />
            {post.views?.toLocaleString()} views
          </span>
        </div>
      </div>
    </article>
  );
}
