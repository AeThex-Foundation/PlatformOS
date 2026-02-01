import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  Mail,
  Home,
  Download,
} from "lucide-react";

interface EducationLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function EducationLayout({ children, hideFooter }: EducationLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Programs", href: "/programs", icon: GraduationCap },
    { name: "About", href: "/about", icon: Users },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src="/aethex-logo.png" alt="AeThex Education" className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  AeThex Education
                </span>
                <span className="text-xs text-gray-500">Learn. Build. Create.</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                      : "text-gray-700 hover:bg-blue-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link to="/download">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Link to="/enroll">Enroll Now</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="flex items-center space-x-2">
                      <img src="/aethex-logo.png" alt="AeThex Education" className="h-8 w-8" />
                      <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        AeThex Education
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col space-y-2">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          "px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-3",
                          isActive(item.href)
                            ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                            : "text-gray-700 hover:bg-blue-50"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="pt-4 border-t space-y-2">
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600"
                      >
                        <Link to="/download">
                          <Download className="mr-2 h-4 w-4" />
                          Download App
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      >
                        <Link to="/enroll">Enroll Now</Link>
                      </Button>
                    </SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {!hideFooter && (
        <footer className="bg-gradient-to-r from-blue-900 to-green-900 text-white mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* About */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <img src="/aethex-logo.png" alt="AeThex Education" className="h-10 w-10" />
                  <h3 className="text-xl font-bold">AeThex Education</h3>
                </div>
                <p className="text-blue-100 text-sm max-w-md">
                  Empowering the next generation of game developers with world-class education
                  in Roblox, Fortnite, Unity, and metaverse technologies. Part of the AeThex
                  Foundation.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>
                    <Link to="/courses" className="hover:text-white transition">
                      Browse Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="hover:text-white transition">
                      Programs & Certificates
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-white transition">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white transition">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>Email: developers@aethex.education</li>
                  <li>Part of AeThex Foundation</li>
                  <li>
                    <a
                      href="https://aethex.foundation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition"
                    >
                      Visit AeThex Foundation →
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 pt-8 border-t border-blue-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
              <p>&copy; {new Date().getFullYear()} AeThex Education. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
