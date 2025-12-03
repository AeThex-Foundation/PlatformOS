import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Music, Upload, Play, Pause, Trash2, Edit, 
  Plus, Loader2, ArrowLeft, Clock, Download, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ethosStorage, getAudioDuration } from "@/lib/ethos-storage";

interface Track {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  file_url: string;
  duration_seconds: number | null;
  genre: string[];
  license_type: string;
  bpm: number | null;
  is_published: boolean;
  download_count: number;
  created_at: string;
}

const GENRE_OPTIONS = [
  "Synthwave", "Orchestral", "Electronic", "Ambient", "Rock",
  "Hip-Hop", "SFX", "Game Audio", "Lo-Fi", "Chiptune"
];

export default function TrackLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGenre, setNewGenre] = useState<string[]>([]);
  const [newLicenseType, setNewLicenseType] = useState("ecosystem");
  const [newBpm, setNewBpm] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      fetchTracks();
    }
  }, [user]);

  async function fetchTracks() {
    try {
      const response = await fetch("/api/ethos/my-profile", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTracks(data.tracks || []);
      }
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!newFile || !newTitle) {
      toast({
        title: "Missing Fields",
        description: "Please provide a title and audio file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const duration = await getAudioDuration(newFile);
      const filePath = await ethosStorage.uploadTrackFile(newFile, user!.id);
      const fileUrl = ethosStorage.getPublicUrl(filePath);

      const response = await fetch("/api/ethos/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || null,
          file_url: fileUrl,
          duration_seconds: Math.round(duration),
          genre: newGenre,
          license_type: newLicenseType,
          bpm: newBpm ? parseInt(newBpm) : null,
          is_published: true,
        }),
      });

      if (response.ok) {
        toast({
          title: "Track Uploaded",
          description: "Your track has been added to your library.",
        });
        setUploadDialogOpen(false);
        resetForm();
        fetchTracks();
      } else {
        throw new Error("Failed to upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload your track. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  async function togglePublished(trackId: string, currentState: boolean) {
    try {
      const response = await fetch(`/api/ethos/tracks/${trackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_published: !currentState }),
      });

      if (response.ok) {
        setTracks(prev => prev.map(t => 
          t.id === trackId ? { ...t, is_published: !currentState } : t
        ));
        toast({
          title: currentState ? "Track Hidden" : "Track Published",
          description: currentState 
            ? "Your track is now hidden from the public." 
            : "Your track is now visible to the community.",
        });
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  }

  async function deleteTrack(trackId: string) {
    if (!confirm("Are you sure you want to delete this track? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/ethos/tracks/${trackId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setTracks(prev => prev.filter(t => t.id !== trackId));
        toast({
          title: "Track Deleted",
          description: "Your track has been removed.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  function resetForm() {
    setNewTitle("");
    setNewDescription("");
    setNewGenre([]);
    setNewLicenseType("ecosystem");
    setNewBpm("");
    setNewFile(null);
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 max-w-md">
          <CardContent className="py-12 text-center">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sign In Required</h3>
            <p className="text-slate-400 mb-6">
              Sign in to manage your audio track library.
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Link to="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" className="text-slate-400 hover:text-white mb-4">
              <Link to="/ethos/settings">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Settings
              </Link>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Track Library</h1>
                <p className="text-slate-400">Manage your audio tracks and uploads</p>
              </div>
            </div>
          </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Plus className="w-4 h-4 mr-2" />
                Upload Track
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white">Upload New Track</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Audio File</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Title *</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Track title"
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe your track..."
                    className="bg-slate-800/50 border-slate-700 resize-none"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">License Type</Label>
                    <Select value={newLicenseType} onValueChange={setNewLicenseType}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecosystem">Ecosystem (Free)</SelectItem>
                        <SelectItem value="commercial_sample">Commercial Sample</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">BPM</Label>
                    <Input
                      type="number"
                      value={newBpm}
                      onChange={(e) => setNewBpm(e.target.value)}
                      placeholder="120"
                      className="bg-slate-800/50 border-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Genres</Label>
                  <div className="flex flex-wrap gap-2">
                    {GENRE_OPTIONS.map(genre => (
                      <button
                        key={genre}
                        onClick={() => setNewGenre(prev => 
                          prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
                        )}
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium transition-all",
                          newGenre.includes(genre)
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                            : "bg-slate-800/50 text-slate-400 border border-slate-700"
                        )}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading || !newFile || !newTitle}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Track
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : tracks.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="py-12 text-center">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Tracks Yet</h3>
              <p className="text-slate-400 mb-6">
                Upload your first track to start building your audio portfolio.
              </p>
              <Button 
                onClick={() => setUploadDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Your First Track
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tracks.map(track => (
              <Card key={track.id} className="bg-slate-900/50 border-slate-800">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPlayingTrack(playingTrack === track.id ? null : track.id)}
                      className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/30 transition-colors"
                    >
                      {playingTrack === track.id ? (
                        <Pause className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Play className="w-5 h-5 text-purple-400 ml-0.5" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium truncate">{track.title}</h3>
                        {!track.is_published && (
                          <Badge variant="secondary" className="text-xs">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(track.duration_seconds)}
                        </span>
                        {track.bpm && <span>{track.bpm} BPM</span>}
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {track.download_count}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {track.genre.slice(0, 3).map(g => (
                          <Badge key={g} variant="secondary" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            track.license_type === "ecosystem" 
                              ? "border-green-500/30 text-green-400" 
                              : "border-amber-500/30 text-amber-400"
                          )}
                        >
                          {track.license_type === "ecosystem" ? "Free Use" : "Commercial"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePublished(track.id, track.is_published)}
                        className="text-slate-400 hover:text-white"
                      >
                        {track.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTrack(track.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {playingTrack === track.id && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <audio 
                        controls 
                        autoPlay 
                        src={track.file_url}
                        className="w-full"
                        onEnded={() => setPlayingTrack(null)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
