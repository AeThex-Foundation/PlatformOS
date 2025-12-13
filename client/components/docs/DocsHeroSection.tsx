import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket, Play } from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

interface DocsHeroSectionProps {
  title?: string;
  description?: string;
  showButtons?: boolean;
}

export default function DocsHeroSection({
  title = "AeThex Foundation Learning Hub",
  description = "Free workforce development programs, career-ready training, and mentorship opportunities. Build job-ready skills in interactive media, web development, and creative technology.",
  showButtons = true,
}: DocsHeroSectionProps) {
  const { colors, theme } = useDocsTheme();
  const buttonClass =
    theme === "professional"
      ? "bg-black hover:bg-gray-900 text-white"
      : "bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700";
  const outlineButtonClass =
    theme === "professional"
      ? "border-gray-300 text-black hover:bg-gray-100"
      : "border-gold-500/50 text-gold-300 hover:bg-gold-500/10";

  return (
    <div className="mb-12 text-center">
      <h2 className={`text-3xl font-bold ${colors.headingColor} mb-4`}>
        {title}
      </h2>
      <p className={`text-xl ${colors.textMuted} mb-8 max-w-3xl mx-auto`}>
        {description}
      </p>

      {showButtons && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className={buttonClass}>
            <Link to="/docs/getting-started">
              <Rocket className="h-5 w-5 mr-2" />
              Start Learning
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={outlineButtonClass}
          >
            <Link to="/programs">
              <Play className="h-5 w-5 mr-2" />
              Browse Programs
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
