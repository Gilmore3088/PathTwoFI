import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Clock, Eye, Calendar, TrendingUp, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/ui/lazy-image";
import { SEO } from "@/components/ui/seo";
import { useState, useMemo } from "react";

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "readTime">(
    "newest",
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Wealth Progress":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800";
      case "FIRE Strategy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800";
      case "Investments":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-800";
      case "Personal Reflections":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 hover:bg-orange-200 dark:hover:bg-orange-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700";
    }
  };

  // Get unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set(posts.map((post) => post.category));
    return Array.from(cats);
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort(
          (a, b) => (b.views || 0) - (a.views || 0),
        );
        break;
      case "readTime":
        filtered = [...filtered].sort((a, b) => a.readTime - b.readTime);
        break;
      case "newest":
      default:
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
        );
    }

    return filtered;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  // Featured post (most recent or most viewed)
  const featuredPost =
    posts.length > 0
      ? posts.reduce((prev, current) =>
          (current.views || 0) > (prev.views || 0) ? current : prev,
        )
      : null;

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
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
      <div className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Journey to Financial Independence
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            The FIRE Journey
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Real insights, transparent progress, and practical strategies on our
            path to Financial Independence
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {posts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Articles
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {posts
                  .reduce((acc, post) => acc + (post.views || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Views
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(
                  posts.reduce((acc, post) => acc + post.readTime, 0) /
                    posts.length,
                ) || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Read Time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="text-gray-400 w-5 h-5" />
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="readTime">Quick Reads</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Post (if exists and not filtered) */}
      {featuredPost && !searchTerm && !selectedCategory && (
        <div className="py-12 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Article
            </h2>
            <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="grid lg:grid-cols-2 gap-0">
                {featuredPost.imageUrl && (
                  <div className="relative h-full min-h-[300px]">
                    <LazyImage
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-400 text-yellow-900 font-medium">
                        ⭐ Featured
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge
                    className={`${getCategoryColor(featuredPost.category)} font-medium mb-4 self-start`}
                  >
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDate(featuredPost.createdAt!)}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime} min read</span>
                      <span>•</span>
                      <span>
                        {featuredPost.views?.toLocaleString() || 0} views
                      </span>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {post.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <LazyImage
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category and Date */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        className={`${getCategoryColor(post.category)} font-medium text-xs`}
                      >
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.createdAt!)}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta and Read More */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime} min
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views?.toLocaleString() || 0}
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">
                {searchTerm || selectedCategory ? "🔍" : "📝"}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {searchTerm || selectedCategory
                  ? "No matching posts"
                  : "No posts yet"}
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

      {/* Newsletter CTA */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated on Our FIRE Journey
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get our latest insights and progress updates delivered to your inbox
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-full hover:bg-gray-100 transition-colors">
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
