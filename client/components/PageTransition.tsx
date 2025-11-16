import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

interface PageConfig {
  message: string;
  accentColor: string;
  armLogo?: string;
  bootMessage?: string;
}

const foundationConfig: PageConfig = {
  message: "Connecting Foundation Network...",
  bootMessage: "Foundation Network Active",
  accentColor: "from-red-500 to-red-400",
  armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const config = foundationConfig;

  useEffect(() => {
    setIsTransitioning(true);
    setVisible(false);

    const transitionTimer = setTimeout(() => {
      setVisible(true);
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(transitionTimer);
  }, [location.pathname]);

  return (
    <>
      {!visible && (
        <div className="fixed inset-0 z-50">
          <LoadingScreen
            message={config.message}
            variant="overlay"
            accentColor={config.accentColor}
            armLogo={config.armLogo}
            showOSLogo={true}
          />

          {/* OS-style Terminal Boot Text (optional decorative element) */}
          {isTransitioning && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
              <div className="text-xs text-muted-foreground font-mono opacity-60 animate-pulse">
                &gt; {config.bootMessage}...
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`transition-opacity duration-300 ease-out transform-gpu will-change-[opacity] ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
