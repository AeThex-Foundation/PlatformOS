import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Gamepad2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Rocket,
  Send,
  Home,
  Target,
  ListTodo,
  ExternalLink,
} from "lucide-react";
import { TeamWidget } from "@/components/TeamWidget";
import SprintManager from "@/components/SprintManager";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function GameForgeDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sprint, setSprint] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [isProjectLead, setIsProjectLead] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!sprint?.end_date) return;

    const timer = setInterval(() => {
      const now = new Date();
      const deadline = new Date(sprint.end_date);
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sprint?.end_date]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const headers = { Authorization: `Bearer ${token}` };

      const [sprintRes, teamRes, tasksRes, projectsRes] = await Promise.all([
        fetch(`${API_BASE}/api/gameforge/sprint`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/gameforge/team`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/gameforge/tasks`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/gameforge/projects`, { headers }).catch(() => null),
      ]);

      if (sprintRes?.ok) {
        const data = await sprintRes.json();
        setSprint(data);
      }

      if (teamRes?.ok) {
        const data = await teamRes.json();
        setTeam(Array.isArray(data) ? data : []);
      }

      if (tasksRes?.ok) {
        const data = await tasksRes.json();
        setTasks(Array.isArray(data) ? data : []);
      }

      if (projectsRes?.ok) {
        const data = await projectsRes.json();
        const projectList = data?.data || [];
        setProjects(projectList);
        if (projectList.some((p: any) => p.lead_id === user?.id)) {
          setIsProjectLead(true);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  }), [tasks]);

  if (authLoading) {
    return (
      <LoadingScreen
        message="Loading GAMEFORGE..."
        accentColor="from-green-500 to-emerald-500"
      />
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-green-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <Gamepad2 className="h-16 w-16 mx-auto text-green-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              GAMEFORGE Studio
            </h1>
            <p className="text-gray-400">Build, collaborate, ship games</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-green-950/10 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {sprint ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                      Mission Control
                    </h1>
                    <p className="text-gray-400 text-lg mt-2">
                      Project: {sprint.gameforge_projects?.name || sprint.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-white text-black hover:bg-gray-100"
                      onClick={() => window.open("https://aethex.studio", "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Studio
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-500/40 text-green-300"
                      onClick={() => navigate("/gameforge")}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      GameForge Home
                    </Button>
                  </div>
                </div>

                {sprint.end_date && (
                  <Card className="bg-gradient-to-br from-green-950/40 to-emerald-950/40 border-green-500/30">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <p className="text-gray-400 text-sm">Time Remaining in Sprint</p>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">{countdown.days}</p>
                            <p className="text-xs text-gray-400">Days</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {String(countdown.hours).padStart(2, "0")}
                            </p>
                            <p className="text-xs text-gray-400">Hours</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {String(countdown.minutes).padStart(2, "0")}
                            </p>
                            <p className="text-xs text-gray-400">Minutes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {String(countdown.seconds).padStart(2, "0")}
                            </p>
                            <p className="text-xs text-gray-400">Seconds</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-green-950/30 border border-green-500/20 p-1">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="scope">Scope</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="sprints">Sprints</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardContent className="p-6 space-y-2">
                        <p className="text-sm text-gray-400">Sprint Phase</p>
                        <p className="text-3xl font-bold text-white capitalize">{sprint.phase}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/20">
                      <CardContent className="p-6 space-y-2">
                        <p className="text-sm text-gray-400">Team Size</p>
                        <p className="text-3xl font-bold text-white">{team.length}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-teal-950/40 to-teal-900/20 border-teal-500/20">
                      <CardContent className="p-6 space-y-2">
                        <p className="text-sm text-gray-400">Tasks Completed</p>
                        <p className="text-3xl font-bold text-white">
                          {tasksByStatus.done.length}/{tasks.length}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/40">
                    <CardContent className="p-8 text-center space-y-4">
                      <h3 className="text-2xl font-bold text-white">Ready to Ship?</h3>
                      <p className="text-gray-300">Submit your final build for evaluation</p>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Final Build
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="scope" className="space-y-4 mt-6">
                  <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Sprint Goal
                      </CardTitle>
                      <CardDescription>Your north star - prevent feature creep</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-black/30 rounded-lg border border-green-500/20">
                        <p className="text-white leading-relaxed">
                          {sprint.goal || sprint.gdd || "No sprint goal defined yet."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-4 mt-6">
                  <TeamWidget
                    members={team.map((m: any) => ({
                      id: m.id,
                      name: m.full_name || "Unknown",
                      role: m.role_title || m.role || "Member",
                      avatar_url: m.avatar_url,
                    }))}
                    title="Sprint Team"
                    description="Current sprint collaborators"
                    accentColor="green"
                    onViewProfile={(memberId) => {
                      const member = team.find((m: any) => m.id === memberId);
                      if (member?.username) {
                        navigate(`/${member.username}`);
                      }
                    }}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                          To Do ({tasksByStatus.todo.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tasksByStatus.todo.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">No tasks</p>
                        ) : (
                          tasksByStatus.todo.map((task: any) => (
                            <div
                              key={task.id}
                              className="p-3 bg-black/30 rounded-lg border border-red-500/20 hover:border-red-500/40 transition"
                            >
                              <p className="font-semibold text-white text-sm">{task.title}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {task.assigned_to_profile?.full_name || "Unassigned"}
                              </p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-950/40 to-yellow-900/20 border-yellow-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="h-5 w-5 text-yellow-400" />
                          In Progress ({tasksByStatus.inprogress.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tasksByStatus.inprogress.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">No tasks</p>
                        ) : (
                          tasksByStatus.inprogress.map((task: any) => (
                            <div
                              key={task.id}
                              className="p-3 bg-black/30 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition"
                            >
                              <p className="font-semibold text-white text-sm">{task.title}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {task.assigned_to_profile?.full_name || "Unassigned"}
                              </p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          Done ({tasksByStatus.done.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tasksByStatus.done.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">No tasks</p>
                        ) : (
                          tasksByStatus.done.map((task: any) => (
                            <div
                              key={task.id}
                              className="p-3 bg-black/30 rounded-lg border border-green-500/20 hover:border-green-500/40 transition"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-semibold text-white text-sm line-through">
                                    {task.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {task.assigned_to_profile?.full_name || "Unassigned"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="sprints" className="space-y-4 mt-6">
                  {sprint && sprint.project_id ? (
                    <SprintManager
                      projectId={sprint.project_id}
                      projectName={sprint.gameforge_projects?.name}
                      isProjectLead={isProjectLead}
                      onSprintJoined={() => loadDashboardData()}
                    />
                  ) : (
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-400">Join a sprint to manage sprints</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
              <CardContent className="p-12 text-center space-y-6">
                <Gamepad2 className="h-12 w-12 mx-auto text-green-500 opacity-50" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Welcome to GAMEFORGE</h2>
                  <p className="text-gray-400">
                    No active sprint. Join or create one to get started!
                  </p>
                </div>
                <div className="space-y-3">
                  {projects.length > 0 && (
                    <SprintManager
                      projectId={projects[0].id}
                      projectName={projects[0].name}
                      isProjectLead={projects[0].lead_id === user?.id}
                      onSprintJoined={() => loadDashboardData()}
                    />
                  )}
                  <Button
                    onClick={() => navigate("/gameforge")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Browse GAMEFORGE
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
