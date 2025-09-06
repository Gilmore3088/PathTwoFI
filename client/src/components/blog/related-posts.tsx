import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { LazyImage } from "@/components/ui/lazy-image";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  currentPost: BlogPost;
  limit?: number;
  className?: string;
}

export function RelatedPosts({ currentPost, limit = 3, className }: RelatedPostsProps) {
  const { data: allPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Find related posts using multiple criteria
  const relatedPosts = allPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.status === 'published'
    )
    .map(post => {
      let score = 0;
      
      // Same category gets high score
      if (post.category === currentPost.category) {
        score += 10;
      }
      
      // Same series gets highest score
      if (post.seriesId && post.seriesId === currentPost.seriesId) {
        score += 20;
      }
      
      // Shared tags increase score
      if (post.tags && currentPost.tags) {
        const sharedTags = post.tags.filter(tag => 
          currentPost.tags?.includes(tag)
        );
        score += sharedTags.length * 5;
      }
      
      // Recent posts get slight preference
      const daysDiff = Math.abs(
        new Date(post.publishedAt || post.createdAt!).getTime() - 
        new Date(currentPost.publishedAt || currentPost.createdAt!).getTime()
      ) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 30) score += 2;
      
      return { ...post, relevanceScore: score };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <Card className={cn("mt-8", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Related Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="group cursor-pointer">
                {post.imageUrl && (
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
                    <LazyImage
                      src={post.imageUrl}
                      alt={post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                    <span>•</span>
                    <span>{format(new Date(post.publishedAt || post.createdAt!), 'MMM dd')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}