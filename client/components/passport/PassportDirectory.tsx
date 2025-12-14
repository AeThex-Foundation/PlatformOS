import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Shield, ExternalLink, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PassportMember {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean;
  level: number;
  total_xp: number;
  primary_role: string | null;
  realm_alignment: string | null;
}

export default function PassportDirectory() {
  const [members, setMembers] = useState<PassportMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<PassportMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "level10">("all");

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    let filtered = members;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.username.toLowerCase().includes(query) ||
        m.full_name?.toLowerCase().includes(query) ||
        m.bio?.toLowerCase().includes(query)
      );
    }
    
    if (filter === "verified") {
      filtered = filtered.filter(m => m.is_verified);
    } else if (filter === "level10") {
      filtered = filtered.filter(m => m.level >= 10);
    }
    
    setFilteredMembers(filtered);
  }, [members, searchQuery, filter]);

  async function fetchMembers() {
    try {
      const response = await fetch("/api/passport/directory");
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error("Failed to fetch directory:", error);
    } finally {
      setLoading(false);
    }
  }

  function getRealmColor(realm: string | null) {
    switch (realm) {
      case "Development Forge": return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "Strategist Nexus": return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "Innovation Commons": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Experience Hub": return "text-green-400 bg-green-500/10 border-green-500/30";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm mb-4">
          <Users className="w-4 h-4" />
          <span>Member Directory</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">AeThex Passport Holders</h2>
        <p className="text-slate-400">
          Browse verified members of the AeThex ecosystem. Each passport represents a unique identity in our community.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700 focus:border-amber-500/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
          >
            All
          </Button>
          <Button
            variant={filter === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("verified")}
            className={filter === "verified" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
          >
            <Shield className="w-3 h-3 mr-1" /> Verified
          </Button>
          <Button
            variant={filter === "level10" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("level10")}
            className={filter === "level10" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
          >
            <Star className="w-3 h-3 mr-1" /> Level 10+
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">
            {searchQuery ? "No members found matching your search." : "No passport holders yet."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="bg-slate-900/50 border-slate-800 hover:border-amber-500/30 transition-all hover-elevate cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14 border-2 border-slate-700 group-hover:border-amber-500/50 transition-colors">
                    <AvatarImage src={member.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-red-500 text-white font-bold">
                      {member.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">
                        {member.full_name || member.username}
                      </h3>
                      {member.is_verified && (
                        <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate">@{member.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-slate-800/50">
                        Lv. {member.level}
                      </Badge>
                      {member.realm_alignment && (
                        <Badge variant="outline" className={cn("text-xs", getRealmColor(member.realm_alignment))}>
                          {member.realm_alignment.split(" ")[0]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {member.bio && (
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2">{member.bio}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500">{member.total_xp.toLocaleString()} XP</span>
                  <a 
                    href={`/${member.username}`}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    View Passport <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
