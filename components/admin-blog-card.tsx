import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Pencil, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminBlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl?: string;
  category: string;
  status: "draft" | "scheduled" | "published";
}

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "secondary" as const,
  },
  scheduled: {
    label: "Scheduled",
    variant: "default" as const,
  },
  published: {
    label: "Published",
    variant: "default" as const,
  },
};

export function AdminBlogCard({
  title,
  excerpt,
  date,
  status,
  category,
}: AdminBlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={statusConfig[status].variant} className="shrink-0">
            {statusConfig[status].label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Change Status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-semibold text-base line-clamp-2 leading-snug">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="pb-3 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-3 gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          View
        </Button>
        <Button size="sm" className="flex-1">
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
