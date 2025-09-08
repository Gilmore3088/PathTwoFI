import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { useState, useMemo } from "react";
import { Clock, Eye, Calendar, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/ui/lazy-image";
import { SEO } from "@/components/ui/seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case "FIRE Strategy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "Investments":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "Personal Reflections":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category));
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    return filtered;
  }, [posts, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Blog - PathTwo FIRE Journey"
        description="Follow our journey to Financial Independence, Retire Early (FIRE) through in-depth articles about wealth tracking, investment strategies, and personal finance insights."
        keywords="FIRE, Financial Independence, Retire Early, personal finance, wealth tracking, investment strategies, blog"
        type="website"
        url="/blog"
      />
      
      {/* Hero Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            The FIRE Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Real insights, transparent progress, and practical strategies on our path to Financial Independence
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
            <span className="text-sm text-gray-600 dark:text-gray-400">{posts.length} articles published</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Filter className="text-gray-400 w-5 h-5" />
              <Button
                size="sm"
                variant={!selectedCategory ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {filteredPosts.length > 0 ? (
            <div className="space-y-12">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                {post.imageUrl && (
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage 
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-8">
                  {/* Category and Date */}
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={`${getCategoryColor(post.category)} font-medium`}>
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(post.createdAt!)}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  {/* Meta and Read More */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {post.readTime} min read
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        {post.views?.toLocaleString() || 0} views
                      </div>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200"
                    >
                      Read Article
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {searchTerm || selectedCategory ? "No matching posts" : "No posts yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedCategory 
                  ? "Try adjusting your filters or search terms" 
                  : "Check back soon for new content!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
