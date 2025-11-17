/**
 * Foundation Creator Directory ("Hall of Fame")
 * 
 * Public showcase of opted-in community members
 * Privacy-First: Only shows users who have explicitly opted in
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Users, Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';

interface Creator {
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string;
  arms: string[];
  roles: string[];
  is_architect: boolean;
}

// Arm color schemes (Foundation branding)
const ARM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  FOUNDATION: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  GAMEFORGE: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  ETHOS: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  LABS: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
};

export default function Creators() {
  const [featuredArchitects, setFeaturedArchitects] = useState<Creator[]>([]);
  const [allCreators, setAllCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedArm, setSelectedArm] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedArm, selectedRole, allCreators]);

  const fetchCreators = async () => {
    try {
      setLoading(true);

      // Fetch Featured Architects
      const featuredRes = await fetch('/api/creators?featured=true');
      const featuredData = await featuredRes.json();
      setFeaturedArchitects(featuredData.creators || []);

      // Fetch All Creators
      const allRes = await fetch('/api/creators?sort=last_active');
      const allData = await allRes.json();
      setAllCreators(allData.creators || []);
    } catch (error) {
      console.error('Failed to fetch creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allCreators];

    if (selectedArm) {
      filtered = filtered.filter(c => c.arms.includes(selectedArm));
    }

    if (selectedRole) {
      filtered = filtered.filter(c => c.roles.includes(selectedRole));
    }

    setFilteredCreators(filtered);
  };

  const clearFilters = () => {
    setSelectedArm(null);
    setSelectedRole(null);
  };

  return (
    <Layout>
      <SEO 
        pageTitle="Creator Directory"
        description="Discover the talented creators, architects, and mentors building the future with the AeThex Foundation."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
              <Users className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Foundation Community</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent">
              Creator Directory
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the architects, mentors, and builders shaping the future of the AeThex Foundation.
            </p>
          </div>

          {/* Featured Architects - "Hall of Fame" */}
          {featuredArchitects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-amber-500" />
                <h2 className="text-3xl font-bold">Featured Architects</h2>
                <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                  Hall of Fame
                </Badge>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-max">
                  {featuredArchitects.map((creator) => (
                    <CreatorCard key={creator.username} creator={creator} featured />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-lg bg-card border border-border">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
            
            <div className="flex gap-2 flex-wrap">
              {['FOUNDATION', 'GAMEFORGE', 'ETHOS', 'LABS'].map((arm) => (
                <Button
                  key={arm}
                  size="sm"
                  variant={selectedArm === arm ? 'default' : 'outline'}
                  onClick={() => setSelectedArm(selectedArm === arm ? null : arm)}
                  className={selectedArm === arm ? '' : ARM_COLORS[arm].text}
                >
                  {arm}
                </Button>
              ))}
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex gap-2 flex-wrap">
              {['Architect', 'Mentor', 'Community Member'].map((role) => (
                <Button
                  key={role}
                  size="sm"
                  variant={selectedRole === role ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                >
                  {role}
                </Button>
              ))}
            </div>

            {(selectedArm || selectedRole) && (
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Full Directory Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Community Directory
              <span className="text-muted-foreground ml-2 text-base font-normal">
                ({filteredCreators.length} {filteredCreators.length === 1 ? 'creator' : 'creators'})
              </span>
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredCreators.length === 0 ? (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No creators match your filters.</p>
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear all filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreators.map((creator) => (
                  <CreatorCard key={creator.username} creator={creator} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}

interface CreatorCardProps {
  creator: Creator;
  featured?: boolean;
}

function CreatorCard({ creator, featured }: CreatorCardProps) {
  return (
    <Link to={`/${creator.username}`} className="block group">
      <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        featured ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent min-w-[320px]' : ''
      }`}>
        <CardContent className="p-6 space-y-4">
          {/* Avatar & Name */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-border group-hover:ring-red-500 transition-all">
              <AvatarImage src={creator.avatar_url || undefined} alt={creator.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-amber-500 text-white font-bold">
                {creator.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg truncate">{creator.full_name}</h3>
                {creator.is_architect && (
                  <Shield className="h-5 w-5 text-amber-500" aria-label="Architect" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{creator.username}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {creator.bio}
          </p>

          {/* Arms & Roles */}
          <div className="space-y-2">
            {creator.arms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {creator.arms.map((arm) => (
                  <Badge
                    key={arm}
                    variant="outline"
                    className={`${ARM_COLORS[arm].bg} ${ARM_COLORS[arm].text} border ${ARM_COLORS[arm].border}`}
                  >
                    {arm}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
