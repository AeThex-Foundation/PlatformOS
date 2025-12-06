import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { supabase } from "@/lib/supabase";
import { Plus, Users, Calendar, CheckCircle, Play, Pause } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Sprint {
  id: string;
  project_id: string;
  sprint_number: number;
  title: string;
  description?: string;
  goal?: string;
  phase: "planning" | "active" | "completed" | "cancelled";
  status: "pending" | "active" | "on_hold" | "completed";
  start_date?: string;
  end_date?: string;
  planned_velocity?: number;
  actual_velocity?: number;
  gameforge_projects?: { name: string };
  gameforge_sprint_members?: Array<{ user_id: string }>;
}

interface SprintManagerProps {
  projectId: string;
  projectName?: string;
  isProjectLead?: boolean;
  onSprintJoined?: (sprint: Sprint) => void;
}

export default function SprintManager({
  projectId,
  projectName,
  isProjectLead = false,
  onSprintJoined,
}: SprintManagerProps) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [userSprints, setUserSprints] = useState<Set<string>>(new Set());
  const { success, error: toastError } = useAethexToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    startDate: "",
    endDate: "",
    plannedVelocity: "",
  });

  useEffect(() => {
    loadSprints();
  }, [projectId]);

  const loadSprints = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(
        `${API_BASE}/api/gameforge/sprints?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        const data = await res.json();
        setSprints(Array.isArray(data) ? data : []);

        const userSprintIds = new Set(
          data
            .filter((sprint: Sprint) =>
              sprint.gameforge_sprint_members?.some(
                (m: any) => m.user_id === session?.user?.id
              )
            )
            .map((s: Sprint) => s.id)
        );
        setUserSprints(userSprintIds as Set<string>);
      }
    } catch (error) {
      console.error("Failed to load sprints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSprint = async () => {
    if (!formData.title.trim()) {
      toastError({ description: "Sprint title is required" });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/gameforge/sprints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          title: formData.title,
          description: formData.description,
          goal: formData.goal,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          plannedVelocity: formData.plannedVelocity
            ? parseInt(formData.plannedVelocity)
            : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create sprint");
      }

      success({ description: "Sprint created successfully!" });
      setCreateOpen(false);
      setFormData({
        title: "",
        description: "",
        goal: "",
        startDate: "",
        endDate: "",
        plannedVelocity: "",
      });
      loadSprints();
    } catch (err: any) {
      toastError({ description: err.message });
    }
  };

  const handleJoinSprint = async (sprint: Sprint) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/gameforge/sprints/${sprint.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "member" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to join sprint");
      }

      success({ description: `Joined sprint: ${sprint.title}` });
      loadSprints();
      onSprintJoined?.(sprint);
    } catch (err: any) {
      toastError({ description: err.message });
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "planning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/40";
      case "completed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/40";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sprint Management
            </CardTitle>
            <CardDescription>
              {projectName ? `Sprints for ${projectName}` : "Manage project sprints"}
            </CardDescription>
          </div>
          {isProjectLead && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Sprint
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-green-500/20">
                <DialogHeader>
                  <DialogTitle>Create New Sprint</DialogTitle>
                  <DialogDescription>
                    Set up a new sprint for your project
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      placeholder="Sprint 1: Core Gameplay"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label>Goal</Label>
                    <Textarea
                      placeholder="What's the sprint goal?"
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData({ ...formData, goal: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateSprint}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Create Sprint
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-400 py-4">Loading sprints...</p>
        ) : sprints.length === 0 ? (
          <p className="text-center text-gray-400 py-4">
            No sprints yet.{" "}
            {isProjectLead && "Create one to get started!"}
          </p>
        ) : (
          <div className="space-y-3">
            {sprints.map((sprint) => (
              <div
                key={sprint.id}
                className="p-4 bg-black/30 rounded-lg border border-green-500/20 hover:border-green-500/40 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">
                        Sprint {sprint.sprint_number}: {sprint.title}
                      </h4>
                      <Badge className={getPhaseColor(sprint.phase)}>
                        {sprint.phase}
                      </Badge>
                    </div>
                    {sprint.goal && (
                      <p className="text-sm text-gray-400 mb-2">{sprint.goal}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {sprint.start_date && (
                        <span>
                          Start: {new Date(sprint.start_date).toLocaleDateString()}
                        </span>
                      )}
                      {sprint.end_date && (
                        <span>
                          End: {new Date(sprint.end_date).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {sprint.gameforge_sprint_members?.length || 0} members
                      </span>
                    </div>
                  </div>
                  <div>
                    {userSprints.has(sprint.id) ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/40">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Joined
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/40 text-green-300 hover:bg-green-500/10"
                        onClick={() => handleJoinSprint(sprint)}
                      >
                        Join Sprint
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
