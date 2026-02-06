import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  color?: "red" | "green" | "blue" | "amber" | "purple";
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
}

export default function GlowText({
  children,
  className,
  color = "red",
  intensity = "medium",
  animated = true
}: GlowTextProps) {
  const colors = {
    red: {
      text: "text-red-400",
      glow: "rgba(239, 68, 68, 0.5)",
      glowStrong: "rgba(239, 68, 68, 0.8)"
    },
    green: {
      text: "text-green-400",
      glow: "rgba(34, 197, 94, 0.5)",
      glowStrong: "rgba(34, 197, 94, 0.8)"
    },
    blue: {
      text: "text-blue-400",
      glow: "rgba(59, 130, 246, 0.5)",
      glowStrong: "rgba(59, 130, 246, 0.8)"
    },
    amber: {
      text: "text-amber-400",
      glow: "rgba(245, 158, 11, 0.5)",
      glowStrong: "rgba(245, 158, 11, 0.8)"
    },
    purple: {
      text: "text-purple-400",
      glow: "rgba(168, 85, 247, 0.5)",
      glowStrong: "rgba(168, 85, 247, 0.8)"
    }
  };

  const intensities = {
    low: "4px",
    medium: "8px",
    high: "16px"
  };

  const theme = colors[color];
  const glowSize = intensities[intensity];

  return (
    <>
      <span
        className={cn(
          theme.text,
          animated && "animate-glow",
          className
        )}
        style={{
          textShadow: `
            0 0 ${glowSize} ${theme.glow},
            0 0 ${parseInt(glowSize) * 2}px ${theme.glow},
            0 0 ${parseInt(glowSize) * 3}px ${theme.glowStrong}
          `
        }}
      >
        {children}
      </span>
      {animated && (
        <style>
          {`
            @keyframes glow {
              0%, 100% {
                filter: brightness(1) drop-shadow(0 0 ${glowSize} ${theme.glow});
              }
              50% {
                filter: brightness(1.2) drop-shadow(0 0 ${parseInt(glowSize) * 2}px ${theme.glowStrong});
              }
            }
            .animate-glow {
              animation: glow 2s ease-in-out infinite;
            }
          `}
        </style>
      )}
    </>
  );
}
