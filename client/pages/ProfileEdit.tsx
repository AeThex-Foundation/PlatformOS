import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Save, ArrowLeft } from "lucide-react";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    location: "",
    user_type: "" as "client" | "game_developer" | "community_member" | "customer" | "staff" | "",
    experience_level: "" as "beginner" | "intermediate" | "advanced" | "expert" | "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        user_type: profile.user_type || "",
        experience_level: profile.experience_level || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        website_url: profile.website_url || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          location: formData.location || null,
          user_type: formData.user_type || null,
          experience_level: formData.experience_level || null,
          github_url: formData.github_url || null,
          linkedin_url: formData.linkedin_url || null,
          twitter_url: formData.twitter_url || null,
          website_url: formData.website_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      await refreshProfile();
      navigate("/profile/me");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return <LoadingScreen message="Loading..." showProgress />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="gap-2 mb-4"
              onClick={() => navigate("/profile/me")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Update your public profile information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your public profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Your role and experience level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user_type">Role</Label>
                  <Select
                    value={formData.user_type}
                    onValueChange={(value) => handleInputChange("user_type", value)}
                  >
                    <SelectTrigger id="user_type">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="game_developer">Game Developer</SelectItem>
                      <SelectItem value="programmer">Programmer</SelectItem>
                      <SelectItem value="artist">Artist</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="sound_designer">Sound Designer</SelectItem>
                      <SelectItem value="producer">Producer</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="hobbyist">Hobbyist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => handleInputChange("experience_level", value)}
                  >
                    <SelectTrigger id="experience_level">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub</Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => handleInputChange("github_url", e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url">Twitter</Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">Portfolio Website</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange("website_url", e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button type="submit" className="gap-2" disabled={saving}>
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile/me")}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileEdit;
