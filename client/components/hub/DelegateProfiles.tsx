import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Vote, FileText, ExternalLink } from "lucide-react";

interface Delegate {
  address: string;
  ensName: string;
  displayName: string;
  votingPower: string;
  proposalsCreated: number;
  votesParticipated: number;
  bio: string;
  gradient: string;
}

interface DelegateProfilesProps {
  delegates: Delegate[];
  title?: string;
}

export function DelegateProfiles({ 
  delegates, 
  title = "Top Delegates" 
}: DelegateProfilesProps) {
  return (
    <Card className="border-red-900/30 bg-gradient-to-br from-red-950/20 to-black/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5 text-red-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {delegates.map((delegate) => (
          <div
            key={delegate.address}
            className="p-4 rounded-lg border border-red-900/30 hover:border-red-500/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <Avatar className={`h-12 w-12 border-2 bg-gradient-to-br ${delegate.gradient}`}>
                <AvatarFallback className="bg-transparent text-white font-bold">
                  {delegate.displayName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">{delegate.displayName}</h4>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    {delegate.votingPower} voting power
                  </Badge>
                </div>
                <p className="text-xs text-gold-400/80 font-mono mb-2">{delegate.ensName}</p>
                <p className="text-sm text-gray-400 line-clamp-2">{delegate.bio}</p>
                
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-red-400" />
                    {delegate.proposalsCreated} proposals
                  </span>
                  <span className="flex items-center gap-1">
                    <Vote className="h-3 w-3 text-gold-400" />
                    {delegate.votesParticipated} votes
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button 
          variant="outline" 
          className="w-full border-red-900/50 hover:bg-red-950/50"
          asChild
        >
          <a
            href="https://www.tally.xyz/gov/aethex/delegates"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Delegates on Tally
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
