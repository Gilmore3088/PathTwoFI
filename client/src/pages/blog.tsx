import { BlogSearch } from "@/components/blog/blog-search";
import { SEO } from "@/components/ui/seo";

export default function BlogPage() {
  return (
    <>
      <SEO 
        title="Blog - PathTwo FIRE Journey"
        description="Follow our journey to Financial Independence, Retire Early (FIRE) through in-depth articles about wealth tracking, investment strategies, and personal finance insights."
        keywords="FIRE, Financial Independence, Retire Early, personal finance, wealth tracking, investment strategies, blog"
        type="website"
        url="/blog"
      />
      
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Our FIRE Journey
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Sharing our path to Financial Independence, Retire Early through transparent
                wealth tracking, strategic insights, and lessons learned along the way.
              </p>
            </header>

            {/* Blog Search and Content */}
            <BlogSearch />
          </div>
        </div>
      </div>
    </>
  );
}
