import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Vote, MessageSquare, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  attendees: number;
  icon: string;
}

interface UpcomingEventsProps {
  events: Event[];
  title?: string;
  compact?: boolean;
}

export function UpcomingEvents({ 
  events, 
  title = "Upcoming Events",
  compact = false 
}: UpcomingEventsProps) {
  const getEventIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case "users": return Users;
      case "vote": return Vote;
      case "message": return MessageSquare;
      case "book": return BookOpen;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Virtual Meeting": return "border-blue-400/50 text-blue-400 bg-blue-500/10";
      case "Voting Period": return "border-red-400/50 text-red-400 bg-red-500/10";
      case "Live Event": return "border-green-400/50 text-green-400 bg-green-500/10";
      case "Workshop": return "border-gold-400/50 text-gold-400 bg-gold-500/10";
      default: return "border-gray-400/50 text-gray-400 bg-gray-500/10";
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {events.map((event) => {
          const IconComponent = getEventIcon(event.icon);
          return (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-border/50 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="h-5 w-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1 line-clamp-1">{event.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{event.date}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </Badge>
                    {event.attendees > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gold-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => {
          const IconComponent = getEventIcon(event.icon);
          return (
            <div
              key={event.id}
              className="p-4 rounded-lg border border-border/30 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-gold-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-red-500/30 group-hover:to-gold-500/30 transition-colors">
                  <IconComponent className="h-6 w-6 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium group-hover:text-gold-400 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    {event.attendees > 0 && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} attending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <Button 
          asChild 
          variant="outline" 
          className="w-full border-gold-500/30 hover:bg-gold-500/10"
        >
          <Link to="/workshops">
            View All Events
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
