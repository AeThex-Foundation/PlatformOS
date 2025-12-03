import ProjectShowcase from "../passport/ProjectShowcase";
import heroImage from "@assets/generated_images/gameforge_project_hero_image.png";
import maleAvatar from "@assets/generated_images/creator_profile_avatar_male.png";
import femaleAvatar from "@assets/generated_images/creator_profile_avatar_female.png";

export default function ProjectShowcaseExample() {
  return (
    <ProjectShowcase
      slug="chroma-shift"
      title="Chroma Shift"
      tagline="Master the art of color in this mind-bending puzzle adventure"
      description="Chroma Shift is an innovative puzzle game where you manipulate the spectrum of light to solve increasingly complex challenges. Navigate through a world where color is your greatest tool and perception is your guide. Blend hues, split beams, and discover the secrets hidden within the prismatic dimensions."
      heroImageUrl={heroImage}
      genre="Puzzle / Adventure"
      platform="PC / Web"
      status="In Development"
      timeline="Q2 2025"
      team={[
        {
          name: "Anderson Gladney",
          role: "Lead Developer",
          avatarUrl: maleAvatar,
          profileUrl: "https://andersongladney.aethex.me",
        },
        {
          name: "Sarah Kim",
          role: "Game Designer",
          avatarUrl: femaleAvatar,
          profileUrl: "https://sarah.aethex.me",
        },
        {
          name: "Marcus Chen",
          role: "Artist",
          profileUrl: "https://marcus.aethex.me",
        },
        {
          name: "Elena Rodriguez",
          role: "Sound Designer",
          profileUrl: "https://elena.aethex.me",
        },
      ]}
      features={[
        "50+ hand-crafted puzzles across 5 unique worlds",
        "Dynamic color-blending mechanics",
        "Atmospheric soundtrack that reacts to gameplay",
        "Speedrun mode with global leaderboards",
        "Accessibility options for color vision differences",
      ]}
    />
  );
}
