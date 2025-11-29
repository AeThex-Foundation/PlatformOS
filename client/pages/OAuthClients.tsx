/**
 * OAuth Client Management Page
 * Admin interface to approve/revoke OAuth clients beyond aethex.dev
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Plus, 
  Key, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface OAuthClient {
  id: string;
  client_id: string;
  client_secret: string;
  name: string;
  description: string;
  redirect_uris: string[];
  website: string;
  logo_url?: string;
  approved: boolean;
  created_at: string;
  created_by: string;
  total_users: number;
  total_logins: number;
}

export default function OAuthClients() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());

  // Check admin permissions
  const isAdmin = roles.some((role) =>
    ["owner", "admin", "founder"].includes(role.toLowerCase())
  );

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/oauth-clients', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      
      const data = await response.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error fetching OAuth clients:', error);
      toast({
        title: "Error",
        description: "Failed to load OAuth clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/admin/oauth-clients");
      return;
    }

    if (!isAdmin) {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "You need admin privileges to manage OAuth clients.",
        variant: "destructive",
      });
      return;
    }

    fetchClients();
  }, [user, isAdmin, navigate, toast]);

  const handleApprove = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/oauth-clients/${clientId}/approve`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to approve client');
      }

      setClients(clients.map(c => 
        c.id === clientId ? { ...c, approved: true } : c
      ));
      toast({
        title: "Client Approved",
        description: "OAuth client has been approved and can now authenticate users",
      });
    } catch (error) {
      console.error('Error approving client:', error);
      toast({
        title: "Error",
        description: "Failed to approve OAuth client",
        variant: "destructive",
      });
    }
  };

  const handleRevoke = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/oauth-clients/${clientId}/revoke`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to revoke client');
      }

      setClients(clients.map(c => 
        c.id === clientId ? { ...c, approved: false } : c
      ));
      toast({
        title: "Client Revoked",
        description: "OAuth client access has been revoked",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error revoking client:', error);
      toast({
        title: "Error",
        description: "Failed to revoke OAuth client",
        variant: "destructive",
      });
    }
  };

  const toggleSecretVisibility = (clientId: string) => {
    setShowSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  if (!user || !isAdmin) {
    return null;
  }

  const approvedClients = clients.filter(c => c.approved);
  const pendingClients = clients.filter(c => !c.approved);

  return (
    <>
      <SEO
        pageTitle="OAuth Client Management"
        description="Manage OAuth clients and integrations with Foundation Passport"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          {/* Header */}
          <section className="space-y-4">
            <Badge variant="outline" className="border-red-400/50 text-red-400">
              <Shield className="h-3 w-3 mr-1" />
              OAuth Management
            </Badge>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">
                  <span className="text-gradient bg-gradient-to-r from-red-500 via-amber-500 to-red-600 bg-clip-text text-transparent">
                    OAuth Client Management
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mt-2">
                  Approve and manage applications that integrate with Foundation Passport
                </p>
              </div>
              <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-aethex-500 to-gold-500">
                    <Plus className="h-4 w-4 mr-2" />
                    New Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create OAuth Client</DialogTitle>
                    <DialogDescription>
                      Register a new application to use Foundation Passport authentication
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Application Name</Label>
                      <Input id="client-name" placeholder="My Awesome Game" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-desc">Description</Label>
                      <Textarea id="client-desc" placeholder="What does this application do?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-website">Website URL</Label>
                      <Input id="client-website" placeholder="https://example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-redirect">Redirect URI</Label>
                      <Input id="client-redirect" placeholder="https://example.com/auth/callback" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-aethex-500 to-gold-500">
                      Create Client
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved Clients</p>
                    <p className="text-2xl font-bold">{approvedClients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/20">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Approval</p>
                    <p className="text-2xl font-bold">{pendingClients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Key className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Authentications</p>
                    <p className="text-2xl font-bold">
                      {clients.reduce((sum, c) => sum + c.total_logins, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Pending Approvals */}
          {pendingClients.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Pending Approvals</h2>
              {pendingClients.map((client) => (
                <Card key={client.id} className="border-amber-400/30 bg-amber-500/5">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-400/30">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        <CardTitle>{client.name}</CardTitle>
                        <CardDescription>{client.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Website</p>
                        <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-aethex-400 hover:underline flex items-center gap-1">
                          {client.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Redirect URIs</p>
                        <p className="font-mono text-xs">{client.redirect_uris[0]}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button 
                        onClick={() => handleApprove(client.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve Client
                      </Button>
                      <Button variant="outline" className="border-red-500/50">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

          {/* Approved Clients */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Approved Clients</h2>
            {approvedClients.map((client) => (
              <Card key={client.id} className="border-border/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/10 text-green-400 border-green-400/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <CardTitle>{client.name}</CardTitle>
                      <CardDescription>{client.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Client Credentials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Client ID</Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded bg-muted font-mono text-xs">
                          {client.client_id}
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(client.client_id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Client Secret</Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded bg-muted font-mono text-xs">
                          {showSecrets.has(client.id) ? client.client_secret : "••••••••••••••••••••"}
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleSecretVisibility(client.id)}
                        >
                          {showSecrets.has(client.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(client.client_secret)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-2xl font-bold">{client.total_users.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{client.total_logins.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Logins</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {new Date(client.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                      <p className="text-xs text-muted-foreground">Created</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="border-blue-500/50">
                      <Key className="h-4 w-4 mr-2" />
                      Rotate Secret
                    </Button>
                    <Button variant="outline" className="border-red-500/50">
                      <XCircle className="h-4 w-4 mr-2" />
                      Revoke Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </Layout>
    </>
  );
}
