/**
 * Corp Integration Examples
 * How aethex.dev will display Foundation Passport data
 * 
 * Copy these components into your Corp codebase
 */

import React from 'react';

// ============================================================================
// EXAMPLE 1: User Dropdown with Passport Link
// ============================================================================

export function UserDropdown({ user }: { user: FoundationUser }) {
  return (
    <div className="user-dropdown">
      <div className="user-info">
        <img 
          src={user.avatar_url} 
          alt={user.username}
          className="avatar"
        />
        <div>
          <div className="font-bold">{user.full_name}</div>
          <div className="text-sm text-gray-400">@{user.username}</div>
          <div className="text-xs text-gray-500">
            Level {user.level} • {user.badge_count} badges
          </div>
        </div>
      </div>
      
      <div className="menu-items">
        <a href="/dashboard">📊 Dashboard</a>
        <a href="/settings">⚙️ Settings</a>
        
        {/* Link to Foundation Passport */}
        <a 
          href={`https://aethex.foundation/${user.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="passport-link"
        >
          🎫 My Passport →
        </a>
        
        <button onClick={() => signOut()}>🚪 Logout</button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Project Author Card
// ============================================================================

export function ProjectAuthorCard({ username }: { username: string }) {
  const [profile, setProfile] = React.useState<PassportProfile | null>(null);
  
  React.useEffect(() => {
    // Fetch public Passport data
    fetch(`https://aethex.foundation/api/passport/${username}`)
      .then(res => res.json())
      .then(setProfile);
  }, [username]);
  
  if (!profile) return <div>Loading...</div>;
  
  return (
    <a 
      href={`https://aethex.foundation/${username}`}
      target="_blank"
      className="author-card hover:shadow-lg transition"
    >
      <img src={profile.avatar_url} alt={username} className="avatar-lg" />
      <div>
        <h3>{profile.full_name}</h3>
        <p className="username">@{username}</p>
        <p className="bio">{profile.bio}</p>
        <div className="stats">
          <span>⭐ Level {profile.level}</span>
          <span>🏆 {profile.badge_count} badges</span>
        </div>
      </div>
    </a>
  );
}

// ============================================================================
// EXAMPLE 3: User Mention Component (Discord-style)
// ============================================================================

export function UserMention({ username }: { username: string }) {
  return (
    <a 
      href={`https://aethex.foundation/${username}`}
      target="_blank"
      className="user-mention"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Foundation red
        color: '#EF4444',
        padding: '2px 6px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: 500,
      }}
    >
      @{username}
    </a>
  );
}

// ============================================================================
// EXAMPLE 4: Team Member Grid
// ============================================================================

export function TeamMemberGrid({ usernames }: { usernames: string[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {usernames.map(username => (
        <TeamMemberCard key={username} username={username} />
      ))}
    </div>
  );
}

function TeamMemberCard({ username }: { username: string }) {
  const [profile, setProfile] = React.useState<PassportProfile | null>(null);
  
  React.useEffect(() => {
    fetch(`https://aethex.foundation/api/passport/${username}`)
      .then(res => res.json())
      .then(setProfile);
  }, [username]);
  
  if (!profile) {
    return (
      <div className="team-card loading">
        <div className="skeleton-avatar" />
        <div className="skeleton-text" />
      </div>
    );
  }
  
  return (
    <a 
      href={`https://aethex.foundation/${username}?ref=aethex_corp`}
      target="_blank"
      className="team-card"
    >
      <img src={profile.avatar_url} alt={username} />
      <div className="name">{profile.full_name}</div>
      <div className="username">@{username}</div>
      <div className="stats">
        <span>Lvl {profile.level}</span>
        <span>•</span>
        <span>{profile.badge_count} 🏆</span>
      </div>
    </a>
  );
}

// ============================================================================
// EXAMPLE 5: Comment with Author (Like GitHub)
// ============================================================================

export function Comment({ comment }: { comment: CommentData }) {
  return (
    <div className="comment">
      <a 
        href={`https://aethex.foundation/${comment.author.username}`}
        target="_blank"
      >
        <img 
          src={comment.author.avatar_url} 
          alt={comment.author.username}
          className="comment-avatar"
        />
      </a>
      
      <div className="comment-body">
        <div className="comment-header">
          <a 
            href={`https://aethex.foundation/${comment.author.username}`}
            target="_blank"
            className="author-name font-bold"
          >
            {comment.author.full_name}
          </a>
          <span className="username text-gray-400">
            @{comment.author.username}
          </span>
          <span className="timestamp">{comment.created_at}</span>
        </div>
        
        <div className="comment-content">
          {comment.content}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Leaderboard with Passport Links
// ============================================================================

export function Leaderboard({ users }: { users: LeaderboardUser[] }) {
  return (
    <div className="leaderboard">
      <h2>Top Contributors</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Level</th>
            <th>XP</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.username}>
              <td className="rank">#{index + 1}</td>
              <td>
                <a 
                  href={`https://aethex.foundation/${user.username}`}
                  target="_blank"
                  className="user-cell"
                >
                  <img src={user.avatar_url} alt={user.username} />
                  <div>
                    <div className="name">{user.full_name}</div>
                    <div className="username">@{user.username}</div>
                  </div>
                </a>
              </td>
              <td className="level">{user.level}</td>
              <td className="xp">{user.total_xp.toLocaleString()}</td>
              <td className="badges">{user.badge_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Inline User Badge
// ============================================================================

export function UserBadge({ username, size = 'sm' }: { 
  username: string; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const [profile, setProfile] = React.useState<PassportProfile | null>(null);
  
  React.useEffect(() => {
    fetch(`https://aethex.foundation/api/passport/${username}`)
      .then(res => res.json())
      .then(setProfile);
  }, [username]);
  
  if (!profile) return <span>@{username}</span>;
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-sm',
    md: 'h-8 w-8 text-base',
    lg: 'h-10 w-10 text-lg',
  };
  
  return (
    <a 
      href={`https://aethex.foundation/${username}`}
      target="_blank"
      className={`user-badge inline-flex items-center gap-2 ${sizeClasses[size]}`}
    >
      <img 
        src={profile.avatar_url} 
        alt={username}
        className={`rounded-full ${sizeClasses[size].split(' ')[0]}`}
      />
      <span className="font-medium">@{username}</span>
      {profile.verified && <span className="verified-badge">✓</span>}
    </a>
  );
}

// ============================================================================
// TYPE DEFINITIONS (From Foundation API)
// ============================================================================

interface FoundationUser {
  sub: string; // Foundation user ID
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string | null;
  level: number;
  total_xp: number;
  badge_count: number;
  verified: boolean;
}

interface PassportProfile {
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  total_xp: number;
  level: number;
  badge_count: number;
  verified: boolean;
}

interface CommentData {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

interface LeaderboardUser {
  username: string;
  full_name: string;
  avatar_url: string;
  level: number;
  total_xp: number;
  badge_count: number;
}

// ============================================================================
// UTILITY HOOK: Fetch Passport Profile
// ============================================================================

export function usePassportProfile(username: string) {
  const [profile, setProfile] = React.useState<PassportProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    setLoading(true);
    fetch(`https://aethex.foundation/api/passport/${username}`)
      .then(res => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [username]);
  
  return { profile, loading, error };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*

// In your Corp components:

// 1. Show current user's Passport link
<UserDropdown user={currentUser} />

// 2. Display project author
<ProjectAuthorCard username="alice" />

// 3. Mention user in text
<p>Great work by <UserMention username="alice" />!</p>

// 4. Show team members
<TeamMemberGrid usernames={['alice', 'bob', 'carol']} />

// 5. Display comment with author link
<Comment comment={commentData} />

// 6. Show leaderboard
<Leaderboard users={topUsers} />

// 7. Inline user badge
<UserBadge username="alice" size="md" />

*/
