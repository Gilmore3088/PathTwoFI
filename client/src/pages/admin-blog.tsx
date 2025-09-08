import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Edit, Trash2, FileText, Star, Eye, Search, Upload, ExternalLink, CheckSquare, Square, Download } from "lucide-react";
import { format } from "date-fns";
import { insertBlogPostSchema, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from '@uppy/core';
import { Link } from "wouter";

export default function AdminBlog() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [previewContent, setPreviewContent] = useState<Partial<InsertBlogPost> | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast({
        title: "Authentication Required",
        description: "Redirecting to login...",
        variant: "destructive",
      });
      // Immediate redirect to login
      window.location.href = "/api/login";
      return;
    }
  }, [isAuthenticated, isAdmin, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Fetch blog posts
  const { data: allBlogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Filtered and searched blog posts
  const blogPosts = useMemo(() => {
    return allBlogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || post.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allBlogPosts, searchTerm, selectedCategory, selectedStatus]);

  // Calculate statistics
  const postStats = useMemo(() => {
    const total = allBlogPosts.length;
    const published = allBlogPosts.filter(post => post.status === 'published').length;
    const drafts = allBlogPosts.filter(post => post.status === 'draft').length;
    const scheduled = allBlogPosts.filter(post => post.status === 'scheduled').length;
    const featured = allBlogPosts.filter(post => post.featured).length;
    return { total, published, drafts, scheduled, featured };
  }, [allBlogPosts]);

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "Personal Reflections",
      readTime: 5,
      featured: false,
      imageUrl: "",
      status: "draft",
      publishedAt: new Date()
    }
  });

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest('POST', '/api/blog-posts', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post created successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<InsertBlogPost> }) => {
      const response = await apiRequest('PUT', `/api/blog-posts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post updated successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive"
      });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => 
        apiRequest('DELETE', `/api/blog-posts/${id}`)
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setSelectedPosts(new Set());
      toast({
        title: "Success",
        description: "Selected blog posts deleted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete selected blog posts",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertBlogPost) => {
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: BlogPost) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt,
      category: item.category,
      readTime: item.readTime,
      featured: item.featured,
      imageUrl: item.imageUrl || "",
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedPosts.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedPosts.size} selected blog posts?`)) {
      bulkDeleteMutation.mutate(Array.from(selectedPosts));
    }
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === blogPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(blogPosts.map(post => post.id)));
    }
  };

  const handleSelectPost = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const handlePreview = () => {
    const currentData = form.getValues();
    setPreviewContent(currentData);
    setIsPreviewOpen(true);
  };

  const handleImageUpload = useCallback(async () => {
    const response = await fetch('/api/objects/upload', {
      method: 'POST',
    });
    const { uploadURL } = await response.json();
    return {
      method: 'PUT' as const,
      url: uploadURL,
    };
  }, []);

  const handleUploadComplete = useCallback((result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const imageUrl = uploadedFile.uploadURL || '';
      form.setValue('imageUrl', imageUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully!"
      });
    }
  }, [form, toast]);

  const resetForm = () => {
    setEditingItem(null);
    form.reset();
  };

  const categories = [
    "Personal Reflections",
    "Wealth Progress",
    "FIRE Strategy",
    "Investment Analysis",
    "Tax Planning"
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Admin Navigation */}
          <div className="flex gap-2 mb-6">
            <Link href="/admin/wealth">
              <Button variant="outline">Wealth Data</Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="outline" className="bg-primary text-primary-foreground">
                Blog Posts
              </Button>
            </Link>
            <Link href="/admin/goals">
              <Button variant="outline">Financial Goals</Button>
            </Link>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-blog-title">
                Blog Post Management
              </h1>
              <p className="text-muted-foreground mt-2" data-testid="text-admin-blog-subtitle">
                Create and manage blog posts for the PathTwo journey
              </p>
              <div className="flex gap-6 mt-4 text-sm" data-testid="stats-blog-overview">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-foreground">{postStats.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="font-semibold text-green-600">{postStats.published}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Drafts:</span>
                  <span className="font-semibold text-yellow-600">{postStats.drafts}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Scheduled:</span>
                  <span className="font-semibold text-purple-600">{postStats.scheduled}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Featured:</span>
                  <span className="font-semibold text-blue-600">{postStats.featured}</span>
                </div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-post">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                <DialogHeader className="shrink-0 pb-6">
                  <DialogTitle className="text-2xl font-semibold" data-testid="text-dialog-title">
                    {editingItem ? "Edit Blog Post" : "Create New Blog Post"}
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    {editingItem ? "Update your blog post details and content" : "Share your PathTwo journey with a compelling blog post"}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Basic Information Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-medium">Basic Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-medium">Post Title *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter an engaging title for your post..." 
                                    {...field} 
                                    data-testid="input-title"
                                    className="h-11"
                                  />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                  Make it catchy and descriptive (recommended: 40-60 characters)
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-medium">URL Slug</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="auto-generated-from-title" 
                                    {...field} 
                                    data-testid="input-slug"
                                    className="h-11"
                                  />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                  Leave empty to auto-generate from title
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="excerpt"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm font-medium">Excerpt *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Write a compelling summary that will appear in post previews..."
                                  {...field}
                                  data-testid="input-excerpt"
                                  className="h-11"
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                This appears in blog post cards and search results (recommended: 120-160 characters)
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publishedAt"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm font-medium">Publish Date & Time</FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  {...field}
                                  value={field.value instanceof Date ? 
                                    field.value.toISOString().slice(0, 16) : 
                                    field.value || new Date().toISOString().slice(0, 16)
                                  }
                                  onChange={(e) => field.onChange(new Date(e.target.value))}
                                  data-testid="input-published-at"
                                  className="h-11"
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Set to future date to schedule publication, or past date for historical posts
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Content Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <Edit className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-medium">Content</h3>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm font-medium">Post Content *</FormLabel>
                              <FormControl>
                                <div className="border rounded-lg overflow-hidden">
                                  <style>{`
                                    .ql-editor {
                                      min-height: 400px;
                                      font-size: 16px;
                                      line-height: 1.6;
                                      padding: 20px;
                                    }
                                    .ql-toolbar {
                                      border-bottom: 1px solid #e5e7eb;
                                      padding: 12px;
                                    }
                                    .ql-container {
                                      border: none;
                                    }
                                    .ql-editor.ql-blank::before {
                                      font-style: normal;
                                      color: #9ca3af;
                                    }
                                    .ql-snow .ql-picker-label {
                                      border: none;
                                    }
                                    .ql-snow .ql-stroke {
                                      stroke: #6b7280;
                                    }
                                    .ql-snow .ql-fill {
                                      fill: #6b7280;
                                    }
                                  `}</style>
                                  <ReactQuill
                                    theme="snow"
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="Tell your story, share insights from your PathTwo journey..."
                                    data-testid="editor-content"
                                    modules={{
                                      toolbar: [
                                        [{ 'header': [2, 3, false] }],
                                        ['bold', 'italic'],
                                        [{'list': 'ordered'}, {'list': 'bullet'}],
                                        ['blockquote', 'link']
                                      ]
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Use the rich text editor to format your content with headings, lists, links, and more
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Media & Settings Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <Star className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-medium">Media & Settings</h3>
                        </div>

                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-medium">Featured Image</FormLabel>
                                <div className="space-y-4">
                                  <div className="flex gap-3">
                                    <FormControl className="flex-1">
                                      <Input 
                                        placeholder="Enter image URL or upload below..." 
                                        {...field}
                                        value={field.value || ""}
                                        data-testid="input-image-url"
                                        className="h-11"
                                      />
                                    </FormControl>
                                    <ObjectUploader
                                      maxNumberOfFiles={1}
                                      maxFileSize={5242880} // 5MB
                                      onGetUploadParameters={handleImageUpload}
                                      onComplete={handleUploadComplete}
                                      buttonClassName="shrink-0 h-11 px-6"
                                    >
                                      <Upload className="w-4 h-4 mr-2" />
                                      Upload Image
                                    </ObjectUploader>
                                  </div>
                                  {field.value && (
                                    <div className="border rounded-lg p-4 bg-muted/20">
                                      <img 
                                        src={field.value} 
                                        alt="Featured image preview" 
                                        className="max-h-40 rounded object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Add a compelling featured image (recommended: 1200x630px, max 5MB)
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-sm font-medium">Category *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-category" className="h-11">
                                        <SelectValue placeholder="Choose category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <p className="text-xs text-muted-foreground">
                                    Help readers find your content
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="readTime"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-sm font-medium">Read Time (minutes)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="1" 
                                      max="60"
                                      placeholder="5" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                                      data-testid="input-read-time"
                                      className="h-11"
                                    />
                                  </FormControl>
                                  <p className="text-xs text-muted-foreground">
                                    Estimated reading time
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-sm font-medium">Publication Status</FormLabel>
                                  <div className="flex gap-4 rounded-lg border p-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        value="published"
                                        checked={field.value === "published"}
                                        onChange={() => field.onChange("published")}
                                        data-testid="radio-published"
                                        className="text-primary focus:ring-primary"
                                      />
                                      <span className="text-sm">Publish Now</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        value="scheduled"
                                        checked={field.value === "scheduled"}
                                        onChange={() => field.onChange("scheduled")}
                                        data-testid="radio-scheduled"
                                        className="text-primary focus:ring-primary"
                                      />
                                      <span className="text-sm">Schedule</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        value="draft"
                                        checked={field.value === "draft"}
                                        onChange={() => field.onChange("draft")}
                                        data-testid="radio-draft"
                                        className="text-primary focus:ring-primary"
                                      />
                                      <span className="text-sm">Save as draft</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {field.value === "draft" && "Drafts won't be visible to visitors"}
                                    {field.value === "scheduled" && "Scheduled posts will be published automatically at the set date"}
                                    {field.value === "published" && "Post will be visible to visitors immediately"}
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="featured"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-sm font-medium">Post Options</FormLabel>
                                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value || false}
                                        onCheckedChange={field.onChange}
                                        data-testid="checkbox-featured"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium cursor-pointer">
                                        Featured Post
                                      </FormLabel>
                                      <p className="text-xs text-muted-foreground">
                                        Show on homepage
                                      </p>
                                    </div>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Scheduled Date Field */}
                            {form.watch("status") === "scheduled" && (
                              <FormField
                                control={form.control}
                                name="scheduledAt"
                                render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-sm font-medium">Scheduled Publish Date & Time</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        data-testid="input-scheduled-at"
                                        className="h-11"
                                      />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                      Set when this post should be automatically published
                                    </p>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="shrink-0 pt-6 border-t bg-background">
                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel"
                      className="h-11 px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreview}
                      data-testid="button-preview"
                      className="h-11 px-6"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-save-post"
                      className="h-11 px-8"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {editingItem ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          {editingItem ? "Update Post" : "Create Post"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                    data-testid="input-search"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Category:</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48" data-testid="select-filter-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Status:</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40" data-testid="select-filter-status">
                      <SelectValue placeholder="All Posts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Drafts</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedPosts.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    data-testid="button-bulk-delete"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedPosts.size})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between" data-testid="text-posts-table-title">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Posts ({blogPosts.length})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8" data-testid="text-loading">
                  Loading blog posts...
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-data">
                  {searchTerm || selectedCategory !== "all" 
                    ? "No posts match your search criteria." 
                    : "No blog posts found. Create your first post to get started."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSelectAll}
                            data-testid="button-select-all"
                          >
                            {selectedPosts.size === blogPosts.length ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Read Time</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPosts.has(post.id)}
                              onCheckedChange={() => handleSelectPost(post.id)}
                              data-testid={`checkbox-select-${post.id}`}
                            />
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="font-medium truncate">{post.title}</div>
                            <div className="text-sm text-muted-foreground truncate">{post.excerpt}</div>
                          </TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                (post as any).status === 'draft' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                  : (post as any).status === 'scheduled'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {(post as any).status === 'draft' ? 'Draft' : 
                                 (post as any).status === 'scheduled' ? 'Scheduled' : 'Published'}
                              </div>
                              {post.featured && <Star className="w-4 h-4 text-yellow-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views || 0}
                            </div>
                          </TableCell>
                          <TableCell>{post.readTime} min</TableCell>
                          <TableCell>{format(new Date(post.createdAt!), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(post)}
                                data-testid={`button-edit-${post.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(post.id)}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-${post.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Preview Blog Post</DialogTitle>
                <DialogDescription>
                  Preview how your blog post will look to readers
                </DialogDescription>
              </DialogHeader>
              {previewContent && (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {previewContent.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{previewContent.category}</span>
                      <span>{previewContent.readTime} min read</span>
                      {previewContent.featured && (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Featured
                        </span>
                      )}
                    </div>
                    {previewContent.imageUrl && (
                      <img 
                        src={previewContent.imageUrl} 
                        alt={previewContent.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <p className="text-lg text-muted-foreground mb-6">
                      {previewContent.excerpt}
                    </p>
                  </div>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewContent.content || '' }}
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}