import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Discussion {
  id: string;
  title: string;
  author: string;
  authorBadge: string;
  replies: number;
  views: number;
  lastActive: string;
  tags: string[];
}

interface DiscussionPreviewProps {
  discussions: Discussion[];
  title?: string;
  showViewAll?: boolean;
}

export function DiscussionPreview({ 
  discussions, 
  title = "Recent Discussions",
  showViewAll = true 
}: DiscussionPreviewProps) {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Diamond": return "border-blue-400/50 text-blue-400 bg-blue-500/10";
      case "Platinum": return "border-red-400/50 text-red-400 bg-red-500/10";
      case "Gold": return "border-gold-400/50 text-gold-400 bg-gold-500/10";
      case "Staff": return "border-red-400/50 text-red-400 bg-red-500/10";
      default: return "border-gray-400/50 text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <Card className="border-border/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-red-400" />
          {title}
        </CardTitle>
        {showViewAll && (
          <Link 
            to="/hub/community" 
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            View All
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="p-4 rounded-lg border border-border/30 hover:border-red-500/30 hover:bg-red-500/5 transition-all cursor-pointer group"
          >
            <div className="space-y-2">
              <h4 className="font-medium group-hover:text-red-400 transition-colors line-clamp-2">
                {discussion.title}
              </h4>
              
              <div className="flex items-center gap-2 flex-wrap">
                {discussion.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs border-border/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span>@{discussion.author}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] py-0 ${getBadgeColor(discussion.authorBadge)}`}
                    >
                      {discussion.authorBadge}
                    </Badge>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {discussion.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {discussion.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {discussion.lastActive}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {showViewAll && (
          <Button 
            asChild 
            variant="outline" 
            className="w-full border-red-500/30 hover:bg-red-500/10 mt-2"
          >
            <Link to="/hub/community">
              Join the Discussion
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
