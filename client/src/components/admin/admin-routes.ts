import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Target,
  MessageSquare,
} from "lucide-react";

export interface AdminRouteConfig {
  href: string;
  label: string;
  icon: LucideIcon;
  color?: string;
  description?: string;
  stats?: string;
}

export const adminRoutes: AdminRouteConfig[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview of PathTwo administration tools",
  },
  {
    href: "/admin/wealth",
    label: "Wealth Data",
    icon: TrendingUp,
    color: "bg-emerald-500",
    description: "Track and manage wealth data entries",
    stats: "Updated daily",
  },
  {
    href: "/admin/blog",
    label: "Blog Posts",
    icon: FileText,
    color: "bg-blue-500",
    description: "Create, schedule, and curate content",
    stats: "Manage posts",
  },
  {
    href: "/admin/goals",
    label: "Financial Goals",
    icon: Target,
    color: "bg-purple-500",
    description: "Set milestones and measure FIRE progress",
    stats: "Track progress",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: MessageSquare,
    color: "bg-orange-500",
    description: "Review conversations from the community",
    stats: "Inbox",
  },
];
