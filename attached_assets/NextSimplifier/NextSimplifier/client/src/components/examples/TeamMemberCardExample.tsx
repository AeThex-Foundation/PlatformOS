import TeamMemberCard from "../passport/TeamMemberCard";
import maleAvatar from "@assets/generated_images/creator_profile_avatar_male.png";
import femaleAvatar from "@assets/generated_images/creator_profile_avatar_female.png";

export default function TeamMemberCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gameforge-dark min-h-[300px]">
      <TeamMemberCard
        name="Alex Chen"
        role="Lead Developer"
        avatarUrl={maleAvatar}
        profileUrl="https://alex.aethex.me"
      />
      <TeamMemberCard
        name="Sarah Kim"
        role="Game Designer"
        avatarUrl={femaleAvatar}
        profileUrl="https://sarah.aethex.me"
      />
    </div>
  );
}
