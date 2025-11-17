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
  AlertCircle
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

export default function Admin() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

    // TODO: Replace with real API endpoint
    // Mock data for now
    const mockUsers: User[] = [
      {
        id: "1",
        username: "mrpiglr",
        full_name: "Mr. PigLR",
        email: "mrpiglr@gmail.com",
        avatar_url: null,
        level: 12,
        total_xp: 5420,
        badge_count: 8,
        created_at: "2024-01-15T00:00:00Z",
        arms: ["FOUNDATION", "LABS"],
        roles: ["Architect"],
      },
      {
        id: "2",
        username: "andersongladney",
        full_name: "Anderson Gladney",
        email: "anderson@example.com",
        avatar_url: null,
        level: 10,
        total_xp: 4200,
        badge_count: 6,
        created_at: "2024-02-01T00:00:00Z",
        arms: ["GAMEFORGE"],
        roles: ["Community Member"],
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, [user, isAdmin, navigate, toast]);

  const handleRoleUpdate = async (userId: string, newRoles: string[]) => {
    // TODO: Implement API call
    toast({
      title: "Roles Updated",
      description: `User roles have been updated successfully`,
    });
  };

  const handleArmUpdate = async (userId: string, newArms: string[]) => {
    // TODO: Implement API call
    toast({
      title: "Arms Updated",
      description: `User arm affiliations have been updated`,
    });
  };

  const handleGrantAchievement = async (userId: string, achievementId: string) => {
    // TODO: Implement API call
    toast({
      title: "Achievement Granted",
      description: `Badge has been awarded successfully`,
    });
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
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="roles">
                <UserCog className="h-4 w-4 mr-2" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Award className="h-4 w-4 mr-2" />
                Achievements
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

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Grant Achievements</CardTitle>
                  <CardDescription>Award badges and achievements to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Achievement Granting System</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Select a user and choose an achievement to grant
                    </p>
                    <Button variant="outline" className="border-gold-400/50">
                      <Award className="h-4 w-4 mr-2" />
                      Browse Achievements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
