import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Vote, Users, FileText, TrendingUp, Wallet } from "lucide-react";

interface VotingStatsProps {
  stats: {
    totalProposals: number;
    passedProposals: number;
    activeVoters: number;
    totalVotesCast: number;
    averageParticipation: string;
    treasuryBalance: string;
  };
}

export function VotingStats({ stats }: VotingStatsProps) {
  const passRate = Math.round((stats.passedProposals / stats.totalProposals) * 100);

  return (
    <Card className="border-red-900/30 bg-gradient-to-br from-red-950/20 to-black/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-gold-400" />
          Governance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/30">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-red-400" />
              <span className="text-xs text-gray-400">Total Proposals</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalProposals}</p>
          </div>
          
          <div className="p-4 rounded-lg bg-green-950/30 border border-green-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Vote className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Passed</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.passedProposals}</p>
          </div>
          
          <div className="p-4 rounded-lg bg-gold-950/30 border border-gold-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gold-400" />
              <span className="text-xs text-gray-400">Active Voters</span>
            </div>
            <p className="text-2xl font-bold text-gold-400">{stats.activeVoters.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Proposal Pass Rate</span>
            <span className="text-white font-medium">{passRate}%</span>
          </div>
          <Progress value={passRate} className="h-2 bg-red-950/50" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-red-900/30">
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Total Votes Cast</p>
            <p className="text-lg font-bold text-white">{stats.totalVotesCast.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Avg. Participation</p>
            <p className="text-lg font-bold text-gold-400">{stats.averageParticipation}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-red-950/40 to-gold-950/40 border border-red-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-gold-400" />
              <span className="text-sm text-gray-300">Treasury Balance</span>
            </div>
            <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">
              {stats.treasuryBalance}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
