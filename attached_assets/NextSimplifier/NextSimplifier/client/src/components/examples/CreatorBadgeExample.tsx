import CreatorBadge from "../passport/CreatorBadge";
import { Gamepad2, Code2, Palette, Wrench } from "lucide-react";

export default function CreatorBadgeExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <CreatorBadge icon={Gamepad2} label="GameForge" />
      <CreatorBadge icon={Code2} label="Architect" />
      <CreatorBadge icon={Palette} label="Designer" />
      <CreatorBadge icon={Wrench} label="Builder" />
    </div>
  );
}
