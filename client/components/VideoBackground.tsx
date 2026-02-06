import { ReactNode, useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoBackgroundProps {
  children: ReactNode;
  videoSrc?: string;
  posterSrc?: string;
  fallbackGradient?: string;
  showControls?: boolean;
  overlay?: boolean;
  overlayOpacity?: number;
}

export default function VideoBackground({
  children,
  videoSrc,
  posterSrc,
  fallbackGradient = "from-red-900/20 via-black to-black",
  showControls = true,
  overlay = true,
  overlayOpacity = 0.7
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      setHasVideo(true);
      videoRef.current.play().catch(() => {
        console.log('[Video] Autoplay prevented');
      });
    }
  }, [videoSrc]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Video or Gradient Background */}
      {videoSrc && hasVideo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={posterSrc}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Overlay */}
          {overlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          )}

          {/* Video Controls */}
          {showControls && (
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </>
      ) : (
        // Fallback gradient if no video
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`} />
      )}

      {/* Animated particles for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-40 right-40 w-48 h-48 bg-red-600/10 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-400/10 rounded-full blur-2xl animate-float-slow" />
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-delay {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-30px) translateX(20px); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float-delay 8s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
          }
        `}
      </style>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
