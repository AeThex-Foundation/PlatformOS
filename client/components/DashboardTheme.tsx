import { ReactNode } from "react";

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  tabsListBg: string;
  headerGradient: string;
  fontFamily?: string;
}

const foundationTheme: ThemeConfig = {
  primaryColor: "red",
  secondaryColor: "orange",
  accentColor: "red-500",
  bgGradient: "from-black via-red-950/20 to-black",
  borderColor: "red-500/20",
  tabsListBg: "red-950/30",
  headerGradient: "from-red-300 via-orange-300 to-red-300",
  fontFamily: "font-serif",
};

export function getTheme(): ThemeConfig {
  return foundationTheme;
}

interface DashboardThemeProviderProps {
  children: ReactNode;
}

export function DashboardThemeProvider({
  children,
}: DashboardThemeProviderProps) {
  const theme = foundationTheme;

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} ${theme.fontFamily}`}
    >
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  const theme = getTheme();

  return (
    <div className="space-y-4 animate-slide-down">
      <div className="space-y-2">
        <h1
          className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme.headerGradient} bg-clip-text text-transparent`}
        >
          {title}
        </h1>
        {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
      </div>
    </div>
  );
}

export function getColorClasses(
  variant: "default" | "alt" = "default",
) {
  const foundationColors = {
    default: {
      card: "bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20",
      cardAlt: "from-orange-950/40 to-orange-900/20 border-orange-500/20",
      text: "text-red-300",
      border: "border-red-500/20",
      accent: "bg-red-600 hover:bg-red-700",
    },
    alt: {
      card: "bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20",
      cardAlt: "from-red-950/40 to-red-900/20 border-red-500/20",
      text: "text-orange-300",
      border: "border-orange-500/20",
      accent: "bg-orange-600 hover:bg-orange-700",
    },
  };

  return foundationColors[variant];
}

export default {
  getTheme,
  getColorClasses,
  DashboardThemeProvider,
  DashboardHeader,
};
