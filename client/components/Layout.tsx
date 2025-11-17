import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SupabaseStatus from "./SupabaseStatus";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  User,
  Settings,
  LogOut,
  Sparkles,
  UserCircle,
  Menu,
  BookOpen,
  Shield,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function CodeLayout({ children, hideFooter }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading, profileComplete } = useAuth();

  const theme = {
    accentHex: "#EF4444",
    wallpaperClass: "",
  };

  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Foundation", href: "/foundation" },
    { name: "Ethics Council", href: "/ethics-council" },
    { name: "Contact", href: "/contact" },
    { name: "Community", href: "/foundation/community" },
    { name: "Documentation", href: "/docs" },
  ];

  const userNavigation = [
    { name: "Hub", href: "/hub" },
    { name: "Protocol", href: "/hub/protocol" },
    { name: "Governance", href: "/hub/governance" },
    { name: "Community", href: "/hub/community" },
    { name: "Curriculum", href: "/foundation/curriculum" },
    { name: "Achievements", href: "/foundation/achievements" },
    { name: "Downloads", href: "/foundation/downloads" },
    { name: "Developers", href: "/foundation/community/developers" },
    { name: "My Profile", href: "/profile/me" },
    { name: "About", href: "/about" },
    { name: "Ethics Council", href: "/ethics-council" },
    { name: "Contact", href: "/contact" },
  ];

  const isSubdomainHost = (() => {
    try {
      const hostname =
        typeof window !== "undefined" ? window.location.hostname : "";
      if (!hostname) return false;
      if (hostname.includes("aethex.me") || hostname.includes("aethex.space")) {
        const parts = hostname.split(".");
        return parts.length > 2;
      }
      return false;
    } catch (e) {
      return false;
    }
  })();

  const passportHref = isSubdomainHost
    ? "/"
    : profile?.username
      ? `/passport/${profile.username}`
      : "/passport/me";

  const navItems: { name: string; href: string }[] = [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-200",
        theme.wallpaperClass,
      )}
    >
      <header
        className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down overflow-hidden transition-all duration-200"
        style={{
          borderBottomColor: theme.accentHex,
          borderBottomWidth: "2px",
          boxShadow: `0 8px 32px ${theme.accentHex}15`,
        }}
      >
        <div className="container mx-auto max-w-7xl flex min-h-16 h-auto items-center justify-between px-3 md:px-4 py-2 gap-1 md:gap-3 lg:gap-4 min-w-0 overflow-hidden">
          {/* Logo */}
          <div className="flex items-center shrink-0 relative">
            {/* Desktop - Regular Link */}
            <Link
              to="/"
              className="hover-glow group inline-block hidden sm:block"
            >
              <img 
                src="/foundation-logo.png" 
                alt="AeThex Foundation" 
                className="h-12 w-12 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              />
            </Link>

            {/* Mobile - Logo Button */}
            <Link
              to="/"
              className="hover-glow group inline-block sm:hidden"
            >
              <img 
                src="/foundation-logo.png" 
                alt="AeThex Foundation" 
                className="h-10 w-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center mx-3" />

          {/* Auth Section */}
          <div className="flex items-center gap-1 md:gap-3 animate-slide-left shrink-0 overflow-visible">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border/60 bg-background/80 backdrop-blur hover:bg-background"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-black/98 backdrop-blur-lg border-gray-800/50 p-3"
                >
                  <SheetHeader className="text-left mb-3">
                    <SheetTitle className="text-xs font-semibold">
                      Navigate
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-0.5 mb-3">
                    {(user ? userNavigation : publicNavigation).map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          to={item.href}
                          onClick={scrollToTop}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="border-t border-gray-800/50 pt-2 space-y-1.5">
                    {loading ? (
                      <div className="h-8 bg-gray-800/40 rounded-md animate-pulse" />
                    ) : user ? (
                      <>
                        <SheetClose asChild>
                          <Link
                            to="/dashboard"
                            onClick={scrollToTop}
                            className="block rounded-md bg-gradient-to-r from-aethex-500 to-neon-blue px-2.5 py-1.5 text-xs font-semibold text-white"
                          >
                            Dashboard
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            type="button"
                            className="w-full text-left rounded-md px-2.5 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            onClick={() => signOut()}
                          >
                            Sign out
                          </button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link
                            to="/login"
                            onClick={scrollToTop}
                            className="block rounded-md bg-gradient-to-r from-aethex-500 to-neon-blue px-2.5 py-1.5 text-xs font-semibold text-white"
                          >
                            Access Hub
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {!loading && (
              <>
                {user ? (
                  // Logged in - always show Dashboard button; show avatar menu if profile exists
                  <div className="flex items-center space-x-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover-lift hidden sm:inline-flex"
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    {!profileComplete && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift glow-blue hidden sm:inline-flex"
                      >
                        <Link to="/onboarding">Complete Setup</Link>
                      </Button>
                    )}
                    <NotificationBell />
                    {!profile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover-lift"
                        onClick={() => signOut()}
                        title="Sign out"
                      >
                        <LogOut className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Sign out</span>
                      </Button>
                    )}
                    {profile && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="relative h-8 w-8 rounded-full hover-lift"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={profile.avatar_url || undefined}
                                alt={profile.full_name || profile.username}
                              />
                              <AvatarFallback>
                                {(profile.full_name || profile.username || "U")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                          <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                              <p className="font-medium">
                                {profile.full_name || profile.username}
                              </p>
                              <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {profile.email}
                              </p>
                            </div>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/dashboard" className="cursor-pointer">
                              <User className="mr-2 h-4 w-4" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/profile" className="cursor-pointer">
                              <UserCircle className="mr-2 h-4 w-4" />
                              My Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={passportHref} className="cursor-pointer">
                              <Sparkles className="mr-2 h-4 w-4" />
                              AeThex Passport
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to="/dashboard?tab=profile#settings"
                              className="cursor-pointer"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Account Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="cursor-pointer">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Control Center
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to="/internal-docs"
                              className="cursor-pointer"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Internal Docs
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => signOut()}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ) : (
                  // Not logged in - show access button
                  <>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale glow-blue"
                    >
                      <Link to="/login">Access Hub</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {!hideFooter && (
        <footer
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-up transition-all duration-200"
          style={{
            borderTopColor: theme.accentHex,
            borderTopWidth: "1px",
            boxShadow: `inset 0 1px 0 ${theme.accentHex}20`,
          }}
        >
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-3 group">
                  <svg
                    className="h-6 w-6 transition-all duration-300 group-hover:scale-110"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        id="footerOSGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                      <filter id="glowFooter">
                        <feGaussianBlur
                          stdDeviation="1.5"
                          result="coloredBlur"
                        />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* OS Window Frame */}
                    <rect
                      x="6"
                      y="6"
                      width="52"
                      height="52"
                      rx="6"
                      fill="none"
                      stroke="url(#footerOSGradient)"
                      strokeWidth="2"
                      opacity="0.6"
                    />

                    {/* Title Bar */}
                    <rect
                      x="6"
                      y="6"
                      width="52"
                      height="12"
                      rx="6"
                      fill="url(#footerOSGradient)"
                      opacity="0.1"
                    />
                    <line
                      x1="6"
                      y1="18"
                      x2="58"
                      y2="18"
                      stroke="url(#footerOSGradient)"
                      strokeWidth="1"
                      opacity="0.2"
                    />

                    {/* System Dots */}
                    <circle
                      cx="12"
                      cy="12"
                      r="1.5"
                      fill="#818cf8"
                      opacity="0.5"
                    />
                    <circle
                      cx="18"
                      cy="12"
                      r="1.5"
                      fill="#a78bfa"
                      opacity="0.5"
                    />
                    <circle
                      cx="24"
                      cy="12"
                      r="1.5"
                      fill="#c4b5fd"
                      opacity="0.5"
                    />

                    {/* Central OS Symbol */}
                    <g transform="translate(32, 35)">
                      <line
                        x1="-6"
                        y1="6"
                        x2="0"
                        y2="-8"
                        stroke="url(#footerOSGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#glowFooter)"
                      />
                      <line
                        x1="6"
                        y1="6"
                        x2="0"
                        y2="-8"
                        stroke="url(#footerOSGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#glowFooter)"
                      />
                      <line
                        x1="-3"
                        y1="0"
                        x2="3"
                        y2="0"
                        stroke="url(#footerOSGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#glowFooter)"
                      />
                      <circle
                        cx="-6"
                        cy="6"
                        r="1.5"
                        fill="#818cf8"
                        opacity="0.7"
                      />
                      <circle
                        cx="6"
                        cy="6"
                        r="1.5"
                        fill="#a78bfa"
                        opacity="0.7"
                      />
                    </g>
                  </svg>
                  <span className="font-bold text-gradient group-hover:animate-pulse">
                    AeThex
                  </span>
                </div>
                <p className="text-sm text-muted-foreground hover:text-muted-foreground/80 transition-colors">
                  Pushing the boundaries of technology through cutting-edge
                  research and breakthrough discoveries.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: `${theme.accentHex}B3` }}
                    />
                    Queen Creek, Arizona
                  </p>
                  <p className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: `${theme.accentHex}B3` }}
                    />
                    <a
                      href="mailto:info@aethex.biz"
                      className="transition-colors"
                      style={{
                        color: "var(--muted-foreground)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "var(--muted-foreground)")
                      }
                    >
                      info@aethex.biz
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: `${theme.accentHex}B3` }}
                    />
                    (346) 556-7100
                  </p>
                </div>
              </div>

              {/* Services */}
              <div
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h3 className="font-semibold text-foreground hover:text-gradient transition-all duration-300">
                  Services
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to="/gameforge"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Game Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/corp"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Development Consulting
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mentorship"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Mentorship Programs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/research"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Research & Labs
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="font-semibold text-foreground hover:text-gradient transition-all duration-300">
                  Company
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to="/about"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      About AeThex
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/opportunities"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Opportunities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/community"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Community Hub
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/changelog"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/status"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      System Status
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/investors"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Investors
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <h3 className="font-semibold text-foreground hover:text-gradient transition-all duration-300">
                  Resources
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to="/docs"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tutorials"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Support Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/trust"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Transparency
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/press"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Press Kit
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center animate-fade-in transition-all duration-200"
              style={{
                animationDelay: "0.4s",
                borderTopColor: theme.accentHex,
                borderTopWidth: "1px",
              }}
            >
              <p className="text-xs text-muted-foreground transition-colors">
                © 2024 AeThex Corporation. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="text-xs text-muted-foreground transition-all duration-300 hover:scale-105"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.accentHex)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "inherit")
                  }
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  onClick={scrollToTop}
                  className="text-xs text-muted-foreground transition-all duration-300 hover:scale-105"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.accentHex)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "inherit")
                  }
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Supabase Configuration Status */}
      <SupabaseStatus />

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
