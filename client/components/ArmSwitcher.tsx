import { useNavigate } from "react-router-dom";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import { GraduationCap, Briefcase, Newspaper, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Arm {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  logoUrl?: string;
  icon?: LucideIcon;
  href: string;
  external?: boolean;
}

const ARMS: Arm[] = [
  {
    id: "gameforge",
    name: "AeThex | GameForge",
    label: "GameForge",
    color: "#22C55E",
    bgColor: "bg-green-500/20",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
    href: "/gameforge",
  },
  {
    id: "mentorship",
    name: "Mentorship Programs",
    label: "Mentorship",
    color: "#F59E0B",
    bgColor: "bg-amber-500/20",
    icon: GraduationCap,
    href: "/mentorship",
  },
  {
    id: "gig-radar",
    name: "Gig Radar",
    label: "Gig Radar",
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    icon: Briefcase,
    href: "/gig-radar",
  },
  {
    id: "blog",
    name: "AeThex Blog",
    label: "Blog",
    color: "#8B5CF6",
    bgColor: "bg-violet-500/20",
    icon: Newspaper,
    href: "/blog",
  },
  {
    id: "staff",
    name: "Staff Portal",
    label: "Staff",
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    icon: Shield,
    href: "/staff/announcements",
  },
];

export default function ArmSwitcher() {
  const navigate = useNavigate();
  const { currentArm, setArm } = useArmTheme();

  const handleArmClick = (arm: Arm) => {
    if (arm.external) {
      window.location.href = arm.href;
    } else {
      if (arm.id === "foundation" || arm.id === "gameforge") {
        setArm(arm.id);
      }
      navigate(arm.href);
    }
  };

  return (
    <>
      {/* Desktop Version - Horizontal Layout (lg+) */}
      <div className="hidden lg:flex items-center gap-4 xl:gap-6">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm)}
            className={`group relative h-12 w-12 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200 flex-shrink-0 ${
              currentArm === arm.id ? "ring-2 ring-current" : ""
            }`}
            title={arm.name}
          >
            <div
              className={`absolute inset-0 rounded-lg ${arm.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            />

            {arm.logoUrl ? (
              <img
                src={arm.logoUrl}
                alt={arm.label}
                className="relative h-9 w-9 object-contain transition-all duration-200"
              />
            ) : arm.icon ? (
              <arm.icon 
                className="relative h-6 w-6 transition-all duration-200" 
                style={{ color: arm.color }}
              />
            ) : null}

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
              {arm.name}
              {arm.external && " →"}
            </div>
          </button>
        ))}
      </div>

      {/* Tablet Version - Show all arms (md to lg) */}
      <div className="hidden md:flex lg:hidden items-center gap-2">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm)}
            className={`group relative h-10 w-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200 flex-shrink-0 ${
              currentArm === arm.id ? "ring-2 ring-current" : ""
            }`}
            title={arm.name}
          >
            {arm.logoUrl ? (
              <img
                src={arm.logoUrl}
                alt={arm.label}
                className="relative h-7 w-7 object-contain transition-all duration-200"
              />
            ) : arm.icon ? (
              <arm.icon 
                className="relative h-5 w-5 transition-all duration-200" 
                style={{ color: arm.color }}
              />
            ) : null}

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
              {arm.name}
              {arm.external && " →"}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Version - Compact horizontal layout */}
      <div className="flex md:hidden items-center gap-2">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm)}
            className={`group relative h-9 w-9 flex items-center justify-center rounded-lg hover:scale-105 transition-all duration-200 flex-shrink-0 ${
              currentArm === arm.id ? "ring-2 ring-current" : ""
            }`}
            title={arm.name}
          >
            <div
              className={`absolute inset-0 rounded-lg ${arm.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            />
            {arm.logoUrl ? (
              <img
                src={arm.logoUrl}
                alt={arm.label}
                className="relative h-6 w-6 object-contain"
              />
            ) : arm.icon ? (
              <arm.icon 
                className="relative h-5 w-5" 
                style={{ color: arm.color }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </>
  );
}
