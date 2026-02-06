import EducationLayout from "@/components/EducationLayout";
import EducationSEO from "@/components/EducationSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Monitor,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Apple,
  Chrome,
  Info
} from "lucide-react";

export default function EducationDownload() {
  const downloads = [
    {
      platform: "Windows",
      icon: Monitor,
      color: "from-blue-600 to-blue-700",
      versions: [
        {
          name: "Installer (Recommended)",
          file: "AeThex-Education-Setup-1.0.0.exe",
          size: "~80 MB",
          description: "Full installer with desktop shortcuts and auto-updates",
          downloadUrl: "#windows-installer" // Replace with actual URL
        },
        {
          name: "Portable Version",
          file: "AeThex-Education-Portable-1.0.0.exe",
          size: "~75 MB",
          description: "No installation required, runs from any folder",
          downloadUrl: "#windows-portable" // Replace with actual URL
        }
      ],
      requirements: [
        "Windows 10 or later (64-bit)",
        "4GB RAM minimum",
        "500MB free disk space",
        ".NET Framework 4.7.2 or higher"
      ]
    },
    {
      platform: "macOS",
      icon: Apple,
      color: "from-gray-700 to-gray-800",
      versions: [
        {
          name: "DMG Installer",
          file: "AeThex-Education-1.0.0.dmg",
          size: "~90 MB",
          description: "Standard macOS disk image installer",
          downloadUrl: "#mac-dmg" // Replace with actual URL
        }
      ],
      requirements: [
        "macOS 10.15 (Catalina) or later",
        "4GB RAM minimum",
        "500MB free disk space",
        "Apple Silicon or Intel processor"
      ]
    },
    {
      platform: "Linux",
      icon: Monitor,
      color: "from-orange-600 to-orange-700",
      versions: [
        {
          name: "AppImage (Universal)",
          file: "AeThex-Education-1.0.0.AppImage",
          size: "~85 MB",
          description: "Works on most Linux distributions",
          downloadUrl: "#linux-appimage" // Replace with actual URL
        },
        {
          name: "Debian Package",
          file: "AeThex-Education-1.0.0.deb",
          size: "~80 MB",
          description: "For Debian, Ubuntu, and derivatives",
          downloadUrl: "#linux-deb" // Replace with actual URL
        }
      ],
      requirements: [
        "64-bit Linux distribution",
        "4GB RAM minimum",
        "500MB free disk space",
        "GTK 3.0 or later"
      ]
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Faster Performance",
      description: "Native desktop app runs smoother than web browsers"
    },
    {
      icon: Monitor,
      title: "Dedicated Window",
      description: "Focus on learning without browser tabs and distractions"
    },
    {
      icon: Shield,
      title: "Offline Access",
      description: "Access downloaded courses even without internet"
    },
    {
      icon: CheckCircle,
      title: "Auto-Updates",
      description: "Always stay up-to-date with the latest features"
    }
  ];

  return (
    <>
      <EducationSEO
        pageTitle="Download Desktop App"
        description="Download AeThex Education desktop app for Windows, macOS, and Linux. Learn game development with a native application experience."
      />
      <EducationLayout>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Download className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Download Desktop App</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get the best learning experience with our native desktop application.
              Available for Windows, macOS, and Linux.
            </p>
            <Badge className="mt-6 bg-white/20 text-white border-white/30 px-4 py-1">
              Version 1.0.0 · Updated Jan 2026
            </Badge>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Use the Desktop App?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience AeThex Education like never before with our dedicated desktop application
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Downloads */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="Windows" className="max-w-5xl mx-auto">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12">
                <TabsTrigger value="Windows">Windows</TabsTrigger>
                <TabsTrigger value="macOS">macOS</TabsTrigger>
                <TabsTrigger value="Linux">Linux</TabsTrigger>
              </TabsList>

              {downloads.map((platform) => (
                <TabsContent key={platform.platform} value={platform.platform}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                          <platform.icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{platform.platform}</CardTitle>
                          <CardDescription>Choose your download option</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Download Options */}
                      <div className="space-y-4">
                        {platform.versions.map((version, idx) => (
                          <Card key={idx} className="border-2 hover:border-blue-500 transition-colors">
                            <CardContent className="pt-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">{version.name}</h3>
                                    {idx === 0 && (
                                      <Badge className="bg-blue-100 text-blue-700">Recommended</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>{version.file}</span>
                                    <span>·</span>
                                    <span>{version.size}</span>
                                  </div>
                                </div>
                                <Button
                                  size="lg"
                                  className="bg-gradient-to-r from-blue-600 to-green-600"
                                  onClick={() => {
                                    // Handle download - replace with actual download URL
                                    alert('Download will be available once the desktop app is built and hosted. Run: npm run electron:build:win');
                                  }}
                                >
                                  <Download className="mr-2 h-5 w-5" />
                                  Download
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* System Requirements */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          System Requirements
                        </h4>
                        <ul className="space-y-2">
                          {platform.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Installation Instructions */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold mb-3">Installation Instructions</h4>
                        {platform.platform === "Windows" && (
                          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>Download the installer or portable version</li>
                            <li>Run the downloaded .exe file</li>
                            <li>Follow the installation wizard (for installer version)</li>
                            <li>Launch AeThex Education from your desktop or Start menu</li>
                          </ol>
                        )}
                        {platform.platform === "macOS" && (
                          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>Download the .dmg file</li>
                            <li>Open the downloaded disk image</li>
                            <li>Drag AeThex Education to your Applications folder</li>
                            <li>Launch from Launchpad or Applications folder</li>
                            <li>If prompted, allow the app in System Preferences → Security</li>
                          </ol>
                        )}
                        {platform.platform === "Linux" && (
                          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>Download the AppImage or .deb package</li>
                            <li>For AppImage: Make it executable with <code className="bg-gray-100 px-1 rounded">chmod +x</code></li>
                            <li>For .deb: Install with <code className="bg-gray-100 px-1 rounded">sudo dpkg -i</code></li>
                            <li>Launch from your applications menu or run directly</li>
                          </ol>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Web Version Alternative */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Chrome className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-4">Prefer to Use in Browser?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              You can also access AeThex Education directly in your web browser without downloading anything.
              The web version has all the same features!
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <a href="https://aethex.education" target="_blank" rel="noopener noreferrer">
                Open Web Version
              </a>
            </Button>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    If you encounter any issues during download or installation, please check our
                    troubleshooting guide in <code className="bg-white px-2 py-1 rounded">DESKTOP_APP.md</code> or
                    contact our support team.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/contact">Contact Support</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
