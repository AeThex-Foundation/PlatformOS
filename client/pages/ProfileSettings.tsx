import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { ProfileEditor } from "@/components/ProfileEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { type AethexUserProfile } from "@/lib/aethex-database-adapter";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, loading } = useAuth();
  const { success: toastSuccess, error: toastError } = useAethexToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (updates: Partial<AethexUserProfile>) => {
    if (!user?.id) {
      toastError("You must be logged in to update your profile");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(updates);
      toastSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toastError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!profile) {
    return (
      <Layout>
        <SEO
          pageTitle="Profile Settings"
          description="Edit your AeThex Foundation profile"
        />
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <div className="text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <SEO
        pageTitle="Profile Settings"
        description="Edit your AeThex Foundation profile"
      />
      <Layout>
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-aethex-500 to-red-500 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your AeThex Foundation profile and preferences
            </p>
          </div>

          <ProfileEditor
            profile={profile}
            onSave={handleSave}
            isSaving={isSaving}
            username={profile.username || undefined}
          />
        </div>
      </Layout>
    </>
  );
}
