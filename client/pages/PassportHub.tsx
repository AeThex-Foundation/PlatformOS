import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Sparkles, Settings, Search } from "lucide-react";
import PassportDirectory from "@/components/passport/PassportDirectory";
import PassportClaim from "@/components/passport/PassportClaim";
import PassportShowcase from "@/components/passport/PassportShowcaseTab";
import PassportAdmin from "@/components/passport/PassportAdmin";
import { cn } from "@/lib/utils";

export default function PassportHub() {
  const { user, roles } = useAuth();
  const isAdmin = roles.some(r => ["admin", "owner", "founder"].includes(r));
  const [activeTab, setActiveTab] = useState("directory");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-950">
      <header className="border-b border-border/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Passport Hub</h1>
                <p className="text-xs text-slate-400">AeThex Identity System</p>
              </div>
            </a>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  Signed in as <span className="text-amber-400">{user.user_metadata?.username || user.email}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-slate-900/50 border border-slate-800 p-1">
            <TabsTrigger 
              value="directory" 
              className={cn(
                "flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-amber-500/20",
                "data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/50"
              )}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Directory</span>
            </TabsTrigger>
            <TabsTrigger 
              value="claim"
              className={cn(
                "flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20",
                "data-[state=active]:text-purple-400 data-[state=active]:border-purple-500/50"
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Claim</span>
            </TabsTrigger>
            <TabsTrigger 
              value="showcase"
              className={cn(
                "flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-cyan-500/20",
                "data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/50"
              )}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Showcase</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger 
                value="admin"
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20",
                  "data-[state=active]:text-red-400 data-[state=active]:border-red-500/50"
                )}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="directory" className="mt-6">
            <PassportDirectory />
          </TabsContent>

          <TabsContent value="claim" className="mt-6">
            <PassportClaim />
          </TabsContent>

          <TabsContent value="showcase" className="mt-6">
            <PassportShowcase />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <PassportAdmin />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
