import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen, Code, Users, Award, Download, GraduationCap, Shield } from "lucide-react";

export default function EducationLanding() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO
        pageTitle="AeThex Education"
        description="Free game development education for the metaverse generation. Part of the AeThex Foundation's mission to empower developers with cross-platform game development skills."
      />
      <Layout hideFooter={false}>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-36">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-green-700/40 to-green-900/60" />
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-80 h-80 opacity-10">
                  <img
                    src="/aethex-logo.png"
                    alt="AeThex Education Logo"
                    className="w-full h-full animate-float"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 relative z-10 pb-24 sm:pb-28">
            <div className="text-center space-y-10">
              <img src="/aethex-logo.png" alt="AeThex Logo" className="mx-auto mb-4 w-20 h-20" />
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-green-400 to-green-600">AeThex Education</h1>
              <h2 className="text-xl sm:text-2xl text-green-200 font-medium mb-4">Free game development education for the metaverse generation</h2>
              <p className="text-lg text-orange-100 max-w-2xl mx-auto mb-8">
                Part of the AeThex Foundation's mission to empower developers with cross-platform game development skills. Launching soon with courses on Roblox, Fortnite, metaverse building, and AeThex tools.
              </p>
              <form action="mailto:developers@aethex.education" method="POST" className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <input type="email" name="email" placeholder="Your email address" required className="px-4 py-2 rounded bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-green-500 text-white font-bold px-6 py-2 rounded shadow hover:from-orange-600 hover:to-green-600 transition">Notify Me</Button>
              </form>
              <div className="text-sm text-green-200 mt-8">An initiative of the AeThex Foundation</div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
