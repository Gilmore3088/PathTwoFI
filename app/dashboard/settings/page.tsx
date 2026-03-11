"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube, 
  Music2,
  Mail,
  Globe,
  Bell,
  Shield,
  Zap,
} from "lucide-react";

interface SocialLink {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  url: string;
}

export default function SettingsPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "twitter", name: "Twitter / X", icon: Twitter, enabled: false, url: "" },
    { id: "instagram", name: "Instagram", icon: Instagram, enabled: false, url: "" },
    { id: "facebook", name: "Facebook", icon: Facebook, enabled: false, url: "" },
    { id: "youtube", name: "YouTube", icon: Youtube, enabled: false, url: "" },
    { id: "tiktok", name: "TikTok", icon: Music2, enabled: false, url: "" },
  ]);

  const toggleSocialLink = (id: string) => {
    setSocialLinks(links =>
      links.map(link =>
        link.id === id ? { ...link, enabled: !link.enabled } : link
      )
    );
  };

  const updateSocialUrl = (id: string, url: string) => {
    setSocialLinks(links =>
      links.map(link =>
        link.id === id ? { ...link, url } : link
      )
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your blog and application preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social & Contact</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Information</CardTitle>
              <CardDescription>
                Update your blog's public information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blog-name">Blog Name</Label>
                <Input
                  id="blog-name"
                  placeholder="PathTwoFI"
                  defaultValue="PathTwoFI"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-tagline">Tagline</Label>
                <Input
                  id="blog-tagline"
                  placeholder="Your Path to Financial Independence"
                  defaultValue="Your Path to Financial Independence"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-description">Description</Label>
                <Textarea
                  id="blog-description"
                  placeholder="A personal finance blog..."
                  defaultValue="A personal finance blog to track a couple's journey to financial independence."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-url">Blog URL</Label>
                <Input
                  id="blog-url"
                  placeholder="https://pathtwofi.com"
                  defaultValue="https://pathtwofi.com"
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage your social media presence. Enable links to display them on your blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <div key={social.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label htmlFor={`${social.id}-url`}>{social.name}</Label>
                          <p className="text-xs text-muted-foreground">
                            {social.enabled ? "Visible on blog" : "Hidden from blog"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={social.enabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSocialLink(social.id)}
                      >
                        {social.enabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    {social.enabled && (
                      <Input
                        id={`${social.id}-url`}
                        placeholder={`https://${social.id}.com/yourusername`}
                        value={social.url}
                        onChange={(e) => updateSocialUrl(social.id, e.target.value)}
                      />
                    )}
                    <Separator />
                  </div>
                );
              })}
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Set up your contact email and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <div className="flex gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="hello@pathtwofi.com"
                    defaultValue="hello@pathtwofi.com"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This email will be displayed on your contact page and used for inquiries.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-to-email">Reply-To Email</Label>
                <Input
                  id="reply-to-email"
                  type="email"
                  placeholder="Optional - different reply address"
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your blog for search engines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  placeholder="PathTwoFI - Your Path to Financial Independence"
                  defaultValue="PathTwoFI - Your Path to Financial Independence"
                />
                <p className="text-xs text-muted-foreground">
                  50-60 characters recommended
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Follow our journey to financial independence..."
                  defaultValue="Follow our journey to financial independence through transparent financial tracking, investment strategies, and practical money management tips."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  150-160 characters recommended
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Keywords</Label>
                <Input
                  id="meta-keywords"
                  placeholder="financial independence, FIRE, investing, budgeting"
                  defaultValue="financial independence, FIRE, investing, budgeting"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="og-image">Open Graph Image URL</Label>
                <Input
                  id="og-image"
                  placeholder="https://pathtwofi.com/og-image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Image displayed when sharing on social media (1200x630px recommended)
                </p>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
              <CardDescription>
                Connect analytics tools to track your blog's performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input
                  id="google-analytics"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-search-console">Google Search Console</Label>
                <Input
                  id="google-search-console"
                  placeholder="Verification code"
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    Light
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Dark
                  </Button>
                  <Button variant="outline" className="flex-1">
                    System
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    defaultValue="#000000"
                    className="w-20 h-10"
                  />
                  <Input
                    placeholder="#000000"
                    defaultValue="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select defaultValue="inter">
                  <SelectTrigger id="font-family">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="opensans">Open Sans</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout Options</CardTitle>
              <CardDescription>
                Configure your blog's layout and display options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="posts-per-page">Posts Per Page</Label>
                <Select defaultValue="12">
                  <SelectTrigger id="posts-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 posts</SelectItem>
                    <SelectItem value="12">12 posts</SelectItem>
                    <SelectItem value="24">24 posts</SelectItem>
                    <SelectItem value="48">48 posts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-layout">Blog Layout</Label>
                <Select defaultValue="grid">
                  <SelectTrigger id="blog-layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="masonry">Masonry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Integration</CardTitle>
              <CardDescription>
                Connect your email marketing service to grow your subscriber list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newsletter-provider">Email Provider</Label>
                <Select defaultValue="none">
                  <SelectTrigger id="newsletter-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="mailchimp">Mailchimp</SelectItem>
                    <SelectItem value="convertkit">ConvertKit</SelectItem>
                    <SelectItem value="substack">Substack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-api-key">API Key</Label>
                <Input
                  id="newsletter-api-key"
                  type="password"
                  placeholder="Enter your API key"
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance & Security</CardTitle>
              <CardDescription>
                Optimize your blog's performance and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Enable Image Optimization
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically optimize images for faster loading
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Enable Comment Moderation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require approval before comments appear
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Disabled
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display maintenance page to visitors
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Disabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
