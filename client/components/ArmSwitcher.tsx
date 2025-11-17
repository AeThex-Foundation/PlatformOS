import { useNavigate } from "react-router-dom";
import { useArmTheme } from "@/contexts/ArmThemeContext";

interface Arm {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  logoUrl: string;
  href: string;
  external?: boolean;
}

const ARMS: Arm[] = [
  {
    id: "foundation",
    name: "AeThex | Foundation",
    label: "Foundation",
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
    href: "/",
  },
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
    id: "labs",
    name: "AeThex | Labs",
    label: "Labs",
    color: "#FBBF24",
    bgColor: "bg-yellow-500/20",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=800",
    href: "https://aethex.dev/labs",
    external: true,
  },
  {
    id: "corp",
    name: "AeThex | Corp",
    label: "Corp",
    color: "#3B82F6",
    bgColor: "bg-blue-500/20",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=800",
    href: "https://aethex.dev/corp",
    external: true,
  },
  {
    id: "devlink",
    name: "AeThex | Dev-Link",
    label: "Dev-Link",
    color: "#06B6D4",
    bgColor: "bg-cyan-500/20",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
    href: "https://aethex.dev/devlink",
    external: true,
  },
  {
    id: "nexus",
    name: "AeThex | Nexus",
    label: "Nexus",
    color: "#EC4899",
    bgColor: "bg-pink-500/20",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800",
    href: "https://aethex.dev/nexus",
    external: true,
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

            <img
              src={arm.logoUrl}
              alt={arm.label}
              className="relative h-9 w-9 object-contain transition-all duration-200"
            />

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
            <img
              src={arm.logoUrl}
              alt={arm.label}
              className="relative h-7 w-7 object-contain transition-all duration-200"
            />

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
              {arm.name}
              {arm.external && " →"}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Version - Compact Grid */}
      <div className="flex md:hidden items-center gap-1.5">
        {ARMS.slice(0, 4).map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm)}
            className={`group relative h-8 w-8 flex items-center justify-center rounded-md hover:scale-105 transition-all duration-200 flex-shrink-0 ${
              currentArm === arm.id ? "ring-1 ring-current" : ""
            }`}
            title={arm.name}
          >
            <img
              src={arm.logoUrl}
              alt={arm.label}
              className="relative h-6 w-6 object-contain"
            />
          </button>
        ))}
      </div>
    </>
  );
}
