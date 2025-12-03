import CreatorProfile from "../passport/CreatorProfile";
import { Gamepad2, Code2, Palette, Wrench, Trophy, Zap } from "lucide-react";
import { Github, Twitter, Globe, Mail } from "lucide-react";
import maleAvatar from "@assets/generated_images/creator_profile_avatar_male.png";

export default function CreatorProfileExample() {
  return (
    <CreatorProfile
      username="andersongladney"
      displayName="Anderson Gladney"
      tagline="Full-Stack Developer & Game Creator"
      bio="Passionate about building immersive digital experiences. Leading the charge at AeThex to create tools that empower creators worldwide. When I'm not coding, you'll find me exploring new game mechanics or mentoring the next generation of developers."
      avatarUrl={maleAvatar}
      isVerified={true}
      badges={[
        { icon: Gamepad2, label: "GameForge" },
        { icon: Code2, label: "Architect" },
        { icon: Palette, label: "Designer" },
        { icon: Wrench, label: "Builder" },
        { icon: Trophy, label: "Pioneer" },
        { icon: Zap, label: "Innovator" },
      ]}
      links={[
        { icon: Github, title: "GitHub", href: "https://github.com/andersongladney" },
        { icon: Twitter, title: "Twitter", href: "https://twitter.com/andersongladney" },
        { icon: Globe, title: "Portfolio", href: "https://andersongladney.dev" },
        { icon: Mail, title: "Contact", href: "mailto:anderson@aethex.dev" },
      ]}
    />
  );
}
