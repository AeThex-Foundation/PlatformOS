/**
 * Admin Dashboard
 * Comprehensive admin interface for user management, role assignment, and achievement granting
 * Requires admin/owner role
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  Users, 
  Award, 
  Search, 
  Crown,
  UserCog,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  MessageSquare,
  ThumbsUp,
  Trash2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  badge_count: number;
  created_at: string;
  arms?: string[];
  roles?: string[];
}

interface Mentor {
  id: number;
  user_id: string;
  bio: string;
  expertise: string[];
  hourly_rate: number;
  available: boolean;
  created_at: string;
  user_profiles?: { username: string; full_name: string; email: string; avatar_url: string | null };
}

interface Opportunity {
  id: number;
  title: string;
  company: string;
  type: string;
  arm: string;
  created_at: string;
  poster_id: string;
}

interface MentorshipRequest {
  id: number;
  mentee_id: string;
  mentor_id: number;
  message: string;
  status: string;
  created_at: string;
}

interface Endorsement {
  id: number;
  endorser_id: string;
  endorsed_id: string;
  skill: string;
  created_at: string;
}

interface AdminStats {
  mentors: number;
  opportunities: number;
  mentorship_requests: number;
  endorsements: number;
}

export default function Admin() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [stats, setStats] = useState<AdminStats>({ mentors: 0, opportunities: 0, mentorship_requests: 0, endorsements: 0 });

  // Check admin permissions
  const isAdmin = roles.some((role) =>
    ["owner", "admin", "founder"].includes(role.toLowerCase())
  );

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/admin");
      return;
    }

    if (!isAdmin) {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, mentorsRes, oppsRes, reqsRes, endorseRes, statsRes] = await Promise.all([
          fetch('/api/admin/users?limit=100', { credentials: 'include' }),
          fetch('/api/admin/mentors', { credentials: 'include' }),
          fetch('/api/admin/opportunities', { credentials: 'include' }),
          fetch('/api/admin/mentorship-requests', { credentials: 'include' }),
          fetch('/api/admin/endorsements', { credentials: 'include' }),
          fetch('/api/admin/stats/overview', { credentials: 'include' })
        ]);

        if (usersRes.ok) {
          const data = await usersRes.json();
          const mapped: User[] = data.users.map((u: any) => ({
            id: u.id,
            username: u.username,
            full_name: u.full_name,
            email: u.email,
            avatar_url: u.avatar_url,
            level: u.level,
            total_xp: u.total_xp,
            badge_count: 0,
            created_at: u.created_at,
            arms: u.arms || [],
            roles: u.roles || [],
          }));
          setUsers(mapped);
        }

        if (mentorsRes.ok) {
          const data = await mentorsRes.json();
          setMentors(data.mentors || []);
        }

        if (oppsRes.ok) {
          const data = await oppsRes.json();
          setOpportunities(data.opportunities || []);
        }

        if (reqsRes.ok) {
          const data = await reqsRes.json();
          setRequests(data.requests || []);
        }

        if (endorseRes.ok) {
          const data = await endorseRes.json();
          setEndorsements(data.endorsements || []);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, navigate, toast]);

  const handleRoleUpdate = async (userId: string, newRoles: string[]) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: newRoles }),
      });
      if (res.ok) {
        toast({
          title: "Roles Updated",
          description: `User roles have been updated successfully`,
        });
        setUsers(users.map(u => u.id === userId ? { ...u, roles: newRoles } : u));
      }
    } catch (error) {
      console.error('Failed to update roles:', error);
    }
  };

  const handleArmUpdate = async (userId: string, newArms: string[]) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arms: newArms }),
      });
      if (res.ok) {
        toast({
          title: "Arms Updated",
          description: `User arm affiliations have been updated`,
        });
        setUsers(users.map(u => u.id === userId ? { ...u, arms: newArms } : u));
      }
    } catch (error) {
      console.error('Failed to update arms:', error);
    }
  };

  const handleGrantAchievement = async (userId: string, achievementId: string) => {
    try {
      const res = await fetch('/api/achievements/grant', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, achievement_id: achievementId }),
      });
      if (res.ok) {
        toast({
          title: "Achievement Granted",
          description: `Badge has been awarded successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to grant achievement:', error);
    }
  };

  const handleToggleMentorAvailability = async (mentorId: number, available: boolean) => {
    try {
      const res = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available }),
      });
      if (res.ok) {
        setMentors(mentors.map(m => m.id === mentorId ? { ...m, available } : m));
        toast({ title: "Mentor Updated", description: `Availability set to ${available ? 'available' : 'unavailable'}` });
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: "Failed to Update", description: errorData.error || 'Could not update mentor', variant: "destructive" });
      }
    } catch (error) {
      console.error('Failed to toggle mentor:', error);
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" });
    }
  };

  const handleDeleteMentor = async (mentorId: number) => {
    try {
      const res = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setMentors(mentors.filter(m => m.id !== mentorId));
        toast({ title: "Mentor Removed", description: "Mentor profile has been deleted" });
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: "Failed to Delete", description: errorData.error || 'Could not delete mentor', variant: "destructive" });
      }
    } catch (error) {
      console.error('Failed to delete mentor:', error);
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" });
    }
  };

  const handleDeleteOpportunity = async (opportunityId: number) => {
    try {
      const res = await fetch(`/api/admin/opportunities/${opportunityId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setOpportunities(opportunities.filter(o => o.id !== opportunityId));
        toast({ title: "Opportunity Removed", description: "Opportunity has been deleted" });
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: "Failed to Delete", description: errorData.error || 'Could not delete opportunity', variant: "destructive" });
      }
    } catch (error) {
      console.error('Failed to delete opportunity:', error);
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" });
    }
  };

  const handleUpdateRequestStatus = async (requestId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/mentorship-requests/${requestId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status } : r));
        toast({ title: "Request Updated", description: `Status changed to ${status}` });
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: "Failed to Update", description: errorData.error || 'Could not update request', variant: "destructive" });
      }
    } catch (error) {
      console.error('Failed to update request:', error);
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" });
    }
  };

  const handleDeleteEndorsement = async (endorsementId: number) => {
    try {
      const res = await fetch(`/api/admin/endorsements/${endorsementId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setEndorsements(endorsements.filter(e => e.id !== endorsementId));
        toast({ title: "Endorsement Removed", description: "Endorsement has been deleted" });
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: "Failed to Delete", description: errorData.error || 'Could not delete endorsement', variant: "destructive" });
      }
    } catch (error) {
      console.error('Failed to delete endorsement:', error);
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <SEO
        pageTitle="Admin Dashboard"
        description="Foundation admin dashboard for user management and moderation"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          {/* Header */}
          <section className="space-y-4">
            <Badge variant="outline" className="border-red-400/50 text-red-400">
              <Shield className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
            <h1 className="text-4xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-red-500 via-amber-500 to-red-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Manage users, assign roles, grant achievements, and oversee Foundation operations
            </p>
          </section>

          {/* Stats Overview */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <Crown className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Architects</p>
                    <p className="text-2xl font-bold">
                      {users.filter((u) => u.roles?.includes("Architect")).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <Activity className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Today</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gold-500/20">
                    <Award className="h-6 w-6 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Badges Earned</p>
                    <p className="text-2xl font-bold">
                      {users.reduce((sum, u) => sum + (u.badge_count || 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Main Content */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="flex flex-wrap gap-2 h-auto p-2">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="roles">
                <UserCog className="h-4 w-4 mr-2" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="mentors">
                <GraduationCap className="h-4 w-4 mr-2" />
                Mentors ({stats.mentors})
              </TabsTrigger>
              <TabsTrigger value="opportunities">
                <Briefcase className="h-4 w-4 mr-2" />
                Opportunities ({stats.opportunities})
              </TabsTrigger>
              <TabsTrigger value="requests">
                <MessageSquare className="h-4 w-4 mr-2" />
                Requests ({stats.mentorship_requests})
              </TabsTrigger>
              <TabsTrigger value="endorsements">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Endorsements ({stats.endorsements})
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View and manage Foundation members</CardDescription>
                    </div>
                    <div className="w-64">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <Card key={user.id} className="border-border/50">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{user.full_name}</p>
                                {user.roles?.includes("Architect") && (
                                  <Badge variant="outline" className="border-purple-400/30 text-purple-400">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Architect
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                @{user.username} • {user.email}
                              </p>
                              <div className="flex gap-2 mt-2">
                                {user.arms?.map((arm) => (
                                  <Badge key={arm} variant="outline" className="text-xs">
                                    {arm}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Level {user.level}</p>
                              <p className="text-xs text-muted-foreground">{user.total_xp} XP</p>
                              <p className="text-xs text-muted-foreground">{user.badge_count} badges</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Role & Arm Assignment</CardTitle>
                  <CardDescription>Assign roles and arm affiliations to users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="border-border/50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-4">
                            <div>
                              <p className="font-semibold">{user.full_name}</p>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Role</label>
                                <Select defaultValue={user.roles?.[0] || "Community Member"}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Community Member">Community Member</SelectItem>
                                    <SelectItem value="Mentor">Mentor</SelectItem>
                                    <SelectItem value="Architect">Architect</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Arms</label>
                                <div className="flex flex-wrap gap-2">
                                  {["GAMEFORGE", "ETHOS", "LABS", "FOUNDATION"].map((arm) => (
                                    <Badge
                                      key={arm}
                                      variant={user.arms?.includes(arm) ? "default" : "outline"}
                                      className="cursor-pointer"
                                    >
                                      {arm}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mentors Tab */}
            <TabsContent value="mentors" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Mentor Management</CardTitle>
                  <CardDescription>View, toggle availability, and remove mentors</CardDescription>
                </CardHeader>
                <CardContent>
                  {mentors.length === 0 ? (
                    <div className="text-center py-12">
                      <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No mentors registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mentors.map((mentor) => (
                        <Card key={mentor.id} className="border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={mentor.user_profiles?.avatar_url || undefined} />
                                  <AvatarFallback>{mentor.user_profiles?.full_name?.[0] || 'M'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{mentor.user_profiles?.full_name || 'Unknown'}</p>
                                  <p className="text-sm text-muted-foreground">@{mentor.user_profiles?.username}</p>
                                  <div className="flex gap-1 mt-1">
                                    {mentor.expertise?.slice(0, 3).map((skill) => (
                                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant={mentor.available ? "default" : "secondary"}>
                                  {mentor.available ? 'Available' : 'Unavailable'}
                                </Badge>
                                <p className="text-sm text-muted-foreground">${mentor.hourly_rate}/hr</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleMentorAvailability(mentor.id, !mentor.available)}
                                >
                                  {mentor.available ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteMentor(mentor.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Opportunity Moderation</CardTitle>
                  <CardDescription>Review and remove job/collaboration postings</CardDescription>
                </CardHeader>
                <CardContent>
                  {opportunities.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No opportunities posted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {opportunities.map((opp) => (
                        <Card key={opp.id} className="border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{opp.title}</p>
                                <p className="text-sm text-muted-foreground">{opp.company}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline">{opp.type}</Badge>
                                  <Badge variant="outline">{opp.arm}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(opp.created_at).toLocaleDateString()}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteOpportunity(opp.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mentorship Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Mentorship Request Oversight</CardTitle>
                  <CardDescription>View and manage mentorship connection requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {requests.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No mentorship requests yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((req) => (
                        <Card key={req.id} className="border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm">
                                  <span className="font-semibold">Mentee:</span> {req.mentee_id.slice(0, 8)}...
                                </p>
                                <p className="text-sm">
                                  <span className="font-semibold">Mentor ID:</span> {req.mentor_id}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                                  {req.message}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <Select
                                  value={req.status}
                                  onValueChange={(val) => handleUpdateRequestStatus(req.id, val)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Endorsements Tab */}
            <TabsContent value="endorsements" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Endorsement Moderation</CardTitle>
                  <CardDescription>Review and remove skill endorsements</CardDescription>
                </CardHeader>
                <CardContent>
                  {endorsements.length === 0 ? (
                    <div className="text-center py-12">
                      <ThumbsUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No endorsements yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {endorsements.map((end) => (
                        <Card key={end.id} className="border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm">
                                  <span className="font-semibold">From:</span> {end.endorser_id.slice(0, 8)}...
                                </p>
                                <p className="text-sm">
                                  <span className="font-semibold">To:</span> {end.endorsed_id.slice(0, 8)}...
                                </p>
                                <Badge variant="outline" className="mt-1">{end.skill}</Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(end.created_at).toLocaleDateString()}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteEndorsement(end.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
