import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/ui/seo";
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts", slug],
  });

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

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        type="article"
        url={`/blog/${post.slug}`}
      />
      
      {/* Back to Blog */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <header className="text-center mb-12">
            <div className="mb-6">
              <Badge className={`${getCategoryColor(post.category)} font-medium mb-4`}>
                {post.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(post.createdAt!)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime} min read
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {post.views?.toLocaleString() || 0} views
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="mb-12">
              <img 
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg prose-gray dark:prose-invert max-w-none
                       prose-headings:font-bold 
                       prose-h1:text-3xl prose-h2:text-2xl
                       prose-p:text-gray-700 dark:prose-p:text-gray-300
                       prose-strong:font-semibold
                       prose-ul:list-disc prose-ul:pl-6
                       prose-ol:list-decimal prose-ol:pl-6
                       prose-li:mb-2
                       prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic
                       prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                       prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Thanks for reading! Follow our FIRE journey for more updates.
            </p>
            
            <Link 
              href="/blog"
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200"
            >
              More Articles
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}