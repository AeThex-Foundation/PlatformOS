import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Rocket, User, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import backgroundPattern from "@assets/generated_images/night_mode_background_pattern.png";

interface ClaimPassportProps {
  slug: string;
  type: "creator" | "project";
  className?: string;
}

export default function ClaimPassport({
  slug,
  type,
  className,
}: ClaimPassportProps) {
  const isCreator = type === "creator";
  const domain = isCreator ? "aethex.me" : "aethex.space";
  const fullDomain = `${slug}.${domain}`;

  if (isCreator) {
    return (
      <div className={cn("min-h-screen bg-background dark", className)}>
        <a
          href="https://aethex.dev"
          className="fixed top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-50"
          data-testid="link-back-aethex"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AeThex</span>
        </a>

        <section
          className="relative min-h-screen flex flex-col items-center justify-center px-6"
          style={{
            backgroundImage: `url(${backgroundPattern})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
            <div className="w-32 h-32 md:w-48 md:h-48 mb-6 rounded-full bg-red-500/20 border-4 border-red-500/40 border-dashed flex items-center justify-center">
              <User className="w-16 h-16 md:w-24 md:h-24 text-red-500/60" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="heading-claim-passport">
                This Passport is Available!
              </h1>
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            </div>

            <p className="text-xl text-red-400 font-medium mb-2" data-testid="text-domain">
              {fullDomain}
            </p>

            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Be the first to claim this creator passport and showcase your work to the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white gap-2"
                asChild
                data-testid="button-claim-passport"
              >
                <a href="https://aethex.foundation">
                  <Rocket className="w-5 h-5" />
                  Claim This Passport
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                asChild
                data-testid="button-learn-more"
              >
                <a href="https://aethex.dev">
                  Learn More
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              Join the AeThex creator network and get your own .aethex.me identity
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gameforge-dark", className)}>
      <a
        href="https://aethex.dev"
        className="fixed top-4 left-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors z-50"
        data-testid="link-back-aethex"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AeThex</span>
      </a>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-gameforge-green/10 via-transparent to-gameforge-dark" />
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(57, 255, 20, 0.03) 2px,
                rgba(57, 255, 20, 0.03) 4px
              )`,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
          <div className="w-32 h-32 md:w-48 md:h-48 mb-6 rounded-lg bg-gameforge-green/20 border-4 border-gameforge-green/40 border-dashed flex items-center justify-center">
            <Gamepad2 className="w-16 h-16 md:w-24 md:h-24 text-gameforge-green/60" />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-gameforge-green animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-white font-pixel" data-testid="heading-claim-passport">
              This Space is Available!
            </h1>
            <Sparkles className="w-6 h-6 text-gameforge-green animate-pulse" />
          </div>

          <p className="text-xl text-gameforge-green font-medium mb-2 font-pixel" data-testid="text-domain">
            {fullDomain}
          </p>

          <p className="text-white/70 text-lg mb-8 max-w-md">
            Launch your game or project showcase here and reach players around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gameforge-green hover:bg-gameforge-green/90 text-gameforge-dark font-bold gap-2"
              asChild
              data-testid="button-claim-passport"
            >
              <a href="https://aethex.foundation">
                <Rocket className="w-5 h-5" />
                Claim This Space
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gameforge-green/50 text-gameforge-green hover:bg-gameforge-green/10"
              asChild
              data-testid="button-learn-more"
            >
              <a href="https://aethex.dev">
                Learn More
              </a>
            </Button>
          </div>

          <p className="text-sm text-white/50 mt-8">
            Join the AeThex network and get your own .aethex.space project showcase
          </p>
        </div>
      </section>
    </div>
  );
}
