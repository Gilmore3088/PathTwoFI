import { AdminBlogCard } from "@/components/admin-blog-card";
import { CreateBlogButton } from "@/components/create-blog-button";

const MOCK_BLOGS = [
  {
    id: "1",
    title: "Our Journey to Financial Independence Begins",
    excerpt: "Starting our path to FI with a clear plan, budget tracking, and long-term investment strategy.",
    date: "2024-10-15",
    author: "PathTwoFI Team",
    imageUrl: "/images/blog-1.jpg",
    category: "Getting Started",
    status: "published" as const,
  },
  {
    id: "2",
    title: "How We Save 50% of Our Income",
    excerpt: "Breaking down our monthly budget and the strategies we use to maximize our savings rate.",
    date: "2024-10-20",
    author: "PathTwoFI Team",
    imageUrl: "/images/blog-2.jpg",
    category: "Budgeting",
    status: "published" as const,
  },
  {
    id: "3",
    title: "Investment Portfolio Update: Q4 2024",
    excerpt: "A detailed look at our portfolio allocation, performance, and adjustments for the next quarter.",
    date: "2024-10-25",
    author: "PathTwoFI Team",
    imageUrl: "/images/blog-3.jpg",
    category: "Investing",
    status: "scheduled" as const,
  },
  {
    id: "4",
    title: "Side Hustles That Fund Our Dreams",
    excerpt: "Exploring additional income streams that accelerate our path to financial independence.",
    date: "2024-10-28",
    author: "PathTwoFI Team",
    imageUrl: "/images/blog-4.jpg",
    category: "Income",
    status: "draft" as const,
  },
  {
    id: "5",
    title: "Tracking Net Worth: Tools and Strategies",
    excerpt: "The apps and spreadsheets we use to monitor our financial progress every month.",
    date: "2024-10-30",
    author: "PathTwoFI Team",
    imageUrl: "/images/blog-5.jpg",
    category: "Tools",
    status: "draft" as const,
  },
  {
    id: "6",
    title: "Our Q4 2024 Financial Review",
    excerpt: "A transparent look at our spending, saving, and investing over the past quarter.",
    date: "2024-11-02",
    author: "PathTwoFI Team",
    imageUrl: "/images/blog-6.jpg",
    category: "Updates",
    status: "draft" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Manage your blog posts and content.
          </p>
        </div>
        <CreateBlogButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_BLOGS.map((blog) => (
          <AdminBlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </div>
  );
}
