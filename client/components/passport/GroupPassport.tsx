import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Github, Users, Calendar } from "lucide-react";

interface GroupMember {
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

interface GroupPassportProps {
  group: {
    id: string;
    name: string;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    website: string | null;
    github_url: string | null;
    created_at: string;
    updated_at: string;
    memberCount: number;
    members: GroupMember[];
  };
  projects: Project[];
  owner?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function GroupPassport({
  group,
  projects,
}: GroupPassportProps) {
  const createdDate = new Date(group.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      <div className="relative">
        {group.banner_url && (
          <div className="h-48 w-full overflow-hidden rounded-lg bg-gradient-to-r from-slate-900 to-slate-800">
            <img
              src={group.banner_url}
              alt={group.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="px-6 py-8">
          <div className="flex items-end gap-6">
            {group.logo_url && (
              <img
                src={group.logo_url}
                alt={group.name}
                className="-mt-16 h-32 w-32 rounded-lg border-4 border-white shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white">
                {group.name}
              </h1>
              <p className="mt-2 text-slate-300">{group.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{group.memberCount} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {createdDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(group.website || group.github_url) && (
        <div className="flex flex-wrap gap-3">
          {group.website && (
            <a href={group.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-200">
                <Globe className="h-4 w-4" />
                Website
              </Button>
            </a>
          )}
          {group.github_url && (
            <a
              href={group.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-200">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </a>
          )}
        </div>
      )}

      {group.members && group.members.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">
            Team Members
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-900/50 p-4"
              >
                {member.user?.avatar_url && (
                  <img
                    src={member.user.avatar_url}
                    alt={member.user.full_name}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {member.user?.full_name}
                  </p>
                  <p className="text-sm text-slate-400">
                    @{member.user?.username}
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">
            Recent Projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50 transition-shadow hover:shadow-lg"
              >
                {project.image_url && (
                  <div className="h-32 w-full overflow-hidden bg-slate-800">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-white">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {project.description}
                    </p>
                  )}
                  <p className="mt-4 text-xs text-slate-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
