import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type ArmType = "foundation" | "gameforge";

export interface ArmTheme {
  arm: ArmType;
  accentColor: string;
  accentHex: string;
  wallpaperClass: string;
  fontClass: string;
  fontFamily: string;
  displayName: string;
  logoUrl: string;
}

const THEMES: Record<ArmType, ArmTheme> = {
  foundation: {
    arm: "foundation",
    accentColor: "from-red-500 to-red-400",
    accentHex: "#EF4444",
    wallpaperClass: "wallpaper-foundation",
    fontClass: "font-foundation",
    fontFamily: '"Merriweather", "Georgia", serif',
    displayName: "Foundation",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
  },
  gameforge: {
    arm: "gameforge",
    accentColor: "from-green-500 to-green-400",
    accentHex: "#22c55e",
    wallpaperClass: "wallpaper-gameforge",
    fontClass: "font-gameforge",
    fontFamily: '"Press Start 2P", "Arial Black", sans-serif',
    displayName: "GameForge",
    logoUrl: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
  },
};

const detectArmFromPath = (pathname: string): ArmType => {
  if (pathname.includes("/gameforge")) return "gameforge";
  return "foundation";
};

interface ArmThemeContextType {
  theme: ArmTheme;
  currentArm: ArmType;
  setArm: (arm: ArmType) => void;
}

const ArmThemeContext = createContext<ArmThemeContextType | undefined>(
  undefined
);

export function ArmThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [currentArm, setCurrentArm] = useState<ArmType>(() => {
    const stored = localStorage.getItem("aethex-arm");
    if (stored === "foundation" || stored === "gameforge") {
      return stored;
    }
    return detectArmFromPath(location.pathname);
  });

  useEffect(() => {
    const pathArm = detectArmFromPath(location.pathname);
    setCurrentArm(pathArm);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("aethex-arm", currentArm);
  }, [currentArm]);

  const theme = THEMES[currentArm];

  const setArm = (arm: ArmType) => {
    setCurrentArm(arm);
    localStorage.setItem("aethex-arm", arm);
  };

  return (
    <ArmThemeContext.Provider value={{ theme, currentArm, setArm }}>
      {children}
    </ArmThemeContext.Provider>
  );
}

export function useArmTheme(): ArmThemeContextType {
  const context = useContext(ArmThemeContext);
  if (!context) {
    throw new Error("useArmTheme must be used within ArmThemeProvider");
  }
  return context;
}
