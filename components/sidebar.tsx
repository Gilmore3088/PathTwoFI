"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Home, FileText, Settings, User, ChevronLeft, BarChart3, Wallet } from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Wealthboard",
    href: "/dashboard/wealthboard",
    icon: Wallet,
  },
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
  },
  {
    title: "Metrics",
    href: "/dashboard/metrics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const bottomNavItem = {
  title: "Account",
  href: "/dashboard/account",
  icon: User,
};

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="PathTwoFI Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold">PathTwoFI</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Image
              src="/images/logo.png"
              alt="PathTwoFI Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </Link>
        )}
      </div>
      <div className="px-3">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-center",
            !isCollapsed && "justify-end"
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full",
                  isCollapsed ? "justify-center px-2" : "justify-start",
                  isActive && "bg-secondary"
                )}
                asChild
                title={isCollapsed ? item.title : undefined}
              >
                <Link href={item.href}>
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-3">
        <Separator className="mb-3" />
        <Button
          variant={pathname === bottomNavItem.href ? "secondary" : "ghost"}
          className={cn(
            "w-full",
            isCollapsed ? "justify-center px-2" : "justify-start",
            pathname === bottomNavItem.href && "bg-secondary"
          )}
          asChild
          title={isCollapsed ? bottomNavItem.title : undefined}
        >
          <Link href={bottomNavItem.href}>
            <bottomNavItem.icon
              className={cn("h-4 w-4", !isCollapsed && "mr-2")}
            />
            {!isCollapsed && bottomNavItem.title}
          </Link>
        </Button>
      </div>
    </div>
  );
}
