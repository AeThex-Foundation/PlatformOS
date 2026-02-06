import { ReactNode } from "react";

interface AnimatedHeroProps {
  children: ReactNode;
  variant?: "foundation" | "gameforge" | "ethos";
  showGrid?: boolean;
  showParticles?: boolean;
}

export default function AnimatedHero({
  children,
  variant = "foundation",
  showGrid = true,
  showParticles = true
}: AnimatedHeroProps) {
  const themes = {
    foundation: {
      primary: "#EF4444", // Red
      secondary: "#DC2626",
      glow: "rgba(239, 68, 68, 0.3)"
    },
    gameforge: {
      primary: "#22C55E", // Green
      secondary: "#16A34A",
      glow: "rgba(34, 197, 94, 0.3)"
    },
    ethos: {
      primary: "#F59E0B", // Amber
      secondary: "#D97706",
      glow: "rgba(245, 158, 11, 0.3)"
    }
  };

  const theme = themes[variant];

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${theme.primary}, transparent 70%)`
        }}
      />

      {/* Animated grid */}
      {showGrid && (
        <>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${theme.primary} 1px, transparent 1px), linear-gradient(90deg, ${theme.primary} 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              animation: "gridPulse 4s ease-in-out infinite"
            }}
          />
          <style>
            {`
              @keyframes gridPulse {
                0%, 100% { opacity: 0.1; }
                50% { opacity: 0.2; }
              }
            `}
          </style>
        </>
      )}

      {/* Animated blobs */}
      {showParticles && (
        <>
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-blob"
            style={{ backgroundColor: theme.glow }}
          />
          <div
            className="absolute top-40 right-10 w-72 h-72 rounded-full blur-3xl animate-blob"
            style={{
              backgroundColor: theme.glow,
              animationDelay: "2s"
            }}
          />
          <div
            className="absolute -bottom-20 left-1/2 w-72 h-72 rounded-full blur-3xl animate-blob"
            style={{
              backgroundColor: theme.glow,
              animationDelay: "4s"
            }}
          />
        </>
      )}

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: `linear-gradient(transparent 0, transparent calc(100% - 1px), ${theme.primary} calc(100% - 1px))`,
          backgroundSize: "100% 32px",
          animation: "scanline 8s linear infinite"
        }}
      />
      <style>
        {`
          @keyframes scanline {
            0% { transform: translateY(0); }
            100% { transform: translateY(32px); }
          }
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
        `}
      </style>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
