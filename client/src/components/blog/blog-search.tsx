import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { Link, useSearch } from "wouter";
import { format } from "date-fns";
import { LazyImage } from "@/components/ui/lazy-image";
import type { BlogPost } from "@shared/schema";
import { cn } from "@/lib/utils";

interface BlogSearchProps {
  className?: string;
}

export function BlogSearch({ className }: BlogSearchProps) {
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Initialize from URL parameters
  useEffect(() => {
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const { data: allPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Extract unique categories and tags
  const { categories, tags } = useMemo(() => {
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();
    
    allPosts.forEach(post => {
      if (post.status === 'published') {
        categorySet.add(post.category);
        if (post.tags) {
          post.tags.forEach(tag => tagSet.add(tag));
        }
      }
    });

    return {
      categories: Array.from(categorySet).sort(),
      tags: Array.from(tagSet).sort()
    };
  }, [allPosts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = allPosts.filter(post => {
      if (post.status !== 'published') return false;

      // Text search
      const searchMatch = !searchTerm || [
        post.title,
        post.excerpt,
        post.content,
        ...(post.tags || [])
      ].some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Category filter
      const categoryMatch = selectedCategory === "all" || post.category === selectedCategory;

      // Tag filter
      const tagMatch = selectedTag === "all" || (post.tags && post.tags.includes(selectedTag));

      return searchMatch && categoryMatch && tagMatch;
    });

    // Sort posts
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => 
          new Date(b.publishedAt || b.createdAt!).getTime() - 
          new Date(a.publishedAt || a.createdAt!).getTime()
        );
        break;
      case "oldest":
        filtered.sort((a, b) => 
          new Date(a.publishedAt || a.createdAt!).getTime() - 
          new Date(b.publishedAt || b.createdAt!).getTime()
        );
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "shortest":
        filtered.sort((a, b) => a.readTime - b.readTime);
        break;
      case "longest":
        filtered.sort((a, b) => b.readTime - a.readTime);
        break;
      default:
        break;
    }

    return filtered;
  }, [allPosts, searchTerm, selectedCategory, selectedTag, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedTag !== "all" || sortBy !== "newest";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-blog-search"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="shortest">Shortest Read</SelectItem>
                  <SelectItem value="longest">Longest Read</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
          {searchTerm && (
            <span> for "{searchTerm}"</span>
          )}
        </p>
      </div>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              <div className="cursor-pointer">
                {post.imageUrl && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <LazyImage
                      src={post.imageUrl}
                      alt={post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary">{post.category}</Badge>
                      {post.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.readTime} min read</span>
                      <span>{format(new Date(post.publishedAt || post.createdAt!), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-3">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}