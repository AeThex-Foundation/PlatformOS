import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, Shield, ShieldCheck, ShieldX, Search, 
  Users, BarChart3, Loader2, AlertCircle, Check, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PassportMember {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_admin: boolean;
  level: number;
  total_xp: number;
  created_at: string;
}

interface Stats {
  total_users: number;
  verified_users: number;
  total_xp: number;
  avg_level: number;
}

export default function PassportAdmin() {
  const { roles } = useAuth();
  const isAdmin = roles.some(r => ["admin", "owner", "founder"].includes(r));
  const { toast } = useToast();
  const [members, setMembers] = useState<PassportMember[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<PassportMember | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  async function fetchData() {
    try {
      const [membersRes, statsRes] = await Promise.all([
        fetch("/api/admin/passport/members", { credentials: "include" }),
        fetch("/api/admin/passport/stats", { credentials: "include" }),
      ]);

      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleVerification(userId: string, currentStatus: boolean) {
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/passport/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, verified: !currentStatus }),
      });

      if (response.ok) {
        setMembers(members.map(m => 
          m.id === userId ? { ...m, is_verified: !currentStatus } : m
        ));
        toast({
          title: currentStatus ? "Verification Removed" : "User Verified",
          description: `User has been ${currentStatus ? "unverified" : "verified"} successfully.`,
        });
        setSelectedUser(null);
      } else {
        throw new Error("Failed to update verification");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  const filteredMembers = members.filter(m => 
    m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Access Denied</h3>
        <p className="text-slate-400">You don't have permission to access this area.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
          <Settings className="w-4 h-4" />
          <span>Admin Dashboard</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Passport Management</h2>
        <p className="text-slate-400">
          Manage user verification, view statistics, and moderate passport profiles.
        </p>
      </div>

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.total_users}</p>
                </div>
                <Users className="w-10 h-10 text-amber-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Verified</p>
                  <p className="text-3xl font-bold text-white">{stats.verified_users}</p>
                </div>
                <ShieldCheck className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total XP</p>
                  <p className="text-3xl font-bold text-white">{stats.total_xp.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-amber-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Level</p>
                  <p className="text-3xl font-bold text-white">{stats.avg_level.toFixed(1)}</p>
                </div>
                <Shield className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Passport Holders</CardTitle>
              <CardDescription>Manage verification status for all users</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Level</TableHead>
                  <TableHead className="text-slate-400">XP</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className="bg-slate-700 text-white text-xs">
                            {member.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{member.full_name || member.username}</p>
                          <p className="text-xs text-slate-500">@{member.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-800/50">
                        Lv. {member.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{member.total_xp.toLocaleString()}</TableCell>
                    <TableCell>
                      {member.is_verified ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Check className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400">
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={member.is_verified ? "outline" : "default"}
                        onClick={() => setSelectedUser(member)}
                        className={member.is_verified ? "" : "bg-green-500 hover:bg-green-600"}
                      >
                        {member.is_verified ? (
                          <>
                            <ShieldX className="w-3 h-3 mr-1" /> Revoke
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verify
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedUser?.is_verified ? "Remove Verification" : "Verify User"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.is_verified
                ? `Are you sure you want to remove verification from @${selectedUser?.username}?`
                : `Are you sure you want to verify @${selectedUser?.username}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && toggleVerification(selectedUser.id, selectedUser.is_verified)}
              disabled={actionLoading}
              className={selectedUser?.is_verified ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : selectedUser?.is_verified ? (
                "Remove Verification"
              ) : (
                "Verify User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
