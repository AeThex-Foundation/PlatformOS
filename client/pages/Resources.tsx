/**
 * Resource Library Page
 * Downloadable materials, guides, templates, and Foundation assets
 */

import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Code, 
  Image as ImageIcon, 
  Package,
  Search,
  Star,
  Eye,
  ArrowDownToLine,
  Folder,
  Video,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { resourceCategories, featuredResources as featuredResourcesData } from "@/lib/content";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "template" | "asset" | "tool";
  category: string;
  format: string;
  size: string;
  downloads: number;
  featured: boolean;
  tags: string[];
  downloadUrl: string;
  previewUrl?: string;
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resources] = useState<Resource[]>([
    {
      id: "1",
      title: "Project Planning Template",
      description: "Comprehensive project template with sections for requirements, milestones, technical specs, and deliverables. Used by 500+ learners.",
      type: "template",
      category: "Design",
      format: "PDF",
      size: "2.4 MB",
      downloads: 1242,
      featured: true,
      tags: ["Design", "Documentation", "Planning"],
      downloadUrl: "/downloads/project-template.pdf",
      previewUrl: "/previews/project-template",
    },
    {
      id: "2",
      title: "React Component Starter Kit",
      description: "Production-ready React components with state management, routing, and API integration. Fully commented and customizable.",
      type: "template",
      category: "Code",
      format: "ZIP",
      size: "45 KB",
      downloads: 2156,
      featured: true,
      tags: ["React", "Components", "Web Development"],
      downloadUrl: "/downloads/react-starter-kit.zip",
    },
    {
      id: "3",
      title: "Foundation Brand Assets",
      description: "Official Foundation logos, color palettes, typography guidelines, and brand identity assets. Includes SVG, PNG, and AI formats.",
      type: "asset",
      category: "Branding",
      format: "ZIP",
      size: "12.8 MB",
      downloads: 856,
      featured: false,
      tags: ["Branding", "Logos", "Design"],
      downloadUrl: "/downloads/foundation-brand-assets.zip",
    },
    {
      id: "4",
      title: "UI/UX Best Practices Guide",
      description: "Complete guide to UI/UX design covering layouts, navigation, accessibility, and user feedback. 45 pages with examples.",
      type: "guide",
      category: "Design",
      format: "PDF",
      size: "8.2 MB",
      downloads: 1834,
      featured: true,
      tags: ["UI/UX", "Design", "Accessibility"],
      downloadUrl: "/downloads/ui-ux-guide.pdf",
      previewUrl: "/previews/ui-ux-guide",
    },
    {
      id: "5",
      title: "CSS Animation Collection",
      description: "20+ ready-to-use CSS animations and transitions including fade, slide, bounce, and loading effects.",
      type: "asset",
      category: "Graphics",
      format: "ZIP",
      size: "5.6 MB",
      downloads: 3421,
      featured: false,
      tags: ["CSS", "Animation", "Web Design"],
      downloadUrl: "/downloads/css-animations.zip",
    },
    {
      id: "6",
      title: "Python Automation Scripts",
      description: "Modular automation toolkit with file processing, web scraping, and data manipulation scripts. MIT licensed.",
      type: "tool",
      category: "AI",
      format: "ZIP",
      size: "1.2 MB",
      downloads: 987,
      featured: false,
      tags: ["Python", "Automation", "Tools"],
      downloadUrl: "/downloads/python-automation.zip",
    },
    {
      id: "7",
      title: "AeThex DAO Governance Guide",
      description: "Complete guide to participating in Foundation governance. Learn about proposals, voting, delegation, and the $AETHEX token.",
      type: "guide",
      category: "Documentation",
      format: "PDF",
      size: "3.1 MB",
      downloads: 423,
      featured: true,
      tags: ["DAO", "Governance", "$AETHEX", "Web3"],
      downloadUrl: "/downloads/dao-governance-guide.pdf",
      previewUrl: "/previews/dao-governance",
    },
    {
      id: "8",
      title: "OAuth 2.0 Integration Starter Kit",
      description: "Ready-to-use code examples for integrating Foundation Passport authentication in React, Next.js, and vanilla JS projects.",
      type: "template",
      category: "Code",
      format: "ZIP",
      size: "156 KB",
      downloads: 678,
      featured: false,
      tags: ["OAuth", "Authentication", "React", "Next.js"],
      downloadUrl: "/downloads/oauth-starter-kit.zip",
    },
    {
      id: "9",
      title: "Icon & Illustration Pack",
      description: "300+ vector icons and illustrations for web and mobile applications. SVG and PNG variants included.",
      type: "asset",
      category: "Graphics",
      format: "ZIP",
      size: "24.5 MB",
      downloads: 4521,
      featured: true,
      tags: ["Icons", "Illustrations", "Design", "UI"],
      downloadUrl: "/downloads/icon-illustration-pack.zip",
    },
    {
      id: "10",
      title: "Presentation Audio Toolkit",
      description: "250+ royalty-free sound effects and 10 background music tracks for presentations, tutorials, and content creation.",
      type: "asset",
      category: "Audio",
      format: "ZIP",
      size: "156 MB",
      downloads: 2876,
      featured: false,
      tags: ["Audio", "SFX", "Music", "Royalty-Free"],
      downloadUrl: "/downloads/audio-toolkit.zip",
    },
    {
      id: "11",
      title: "Database Schema Templates",
      description: "Ready-to-use database schemas for common applications including user management, e-commerce, and content systems.",
      type: "tool",
      category: "Systems",
      format: "ZIP",
      size: "2.8 MB",
      downloads: 1543,
      featured: false,
      tags: ["Database", "Schema", "SQL", "Systems"],
      downloadUrl: "/downloads/database-schemas.zip",
    },
    {
      id: "12",
      title: "Digital Literacy Workbook",
      description: "Comprehensive workbook covering essential digital skills. Includes exercises, assessments, and real-world scenarios.",
      type: "guide",
      category: "Business",
      format: "PDF",
      size: "5.4 MB",
      downloads: 987,
      featured: false,
      tags: ["Digital Literacy", "Workbook", "Skills", "Training"],
      downloadUrl: "/downloads/digital-literacy-workbook.pdf",
    },
    {
      id: "13",
      title: "API Documentation Template",
      description: "Professional API documentation template with endpoint descriptions, examples, and authentication guides.",
      type: "tool",
      category: "Narrative",
      format: "ZIP",
      size: "1.9 MB",
      downloads: 1122,
      featured: false,
      tags: ["API", "Documentation", "Template", "REST"],
      downloadUrl: "/downloads/api-docs-template.zip",
    },
    {
      id: "14",
      title: "Website Template Collection",
      description: "Responsive website templates for portfolios, landing pages, and business sites. Mobile-optimized.",
      type: "asset",
      category: "3D",
      format: "ZIP",
      size: "89 MB",
      downloads: 1876,
      featured: false,
      tags: ["HTML", "CSS", "Templates", "Responsive"],
      downloadUrl: "/downloads/website-templates.zip",
    },
    {
      id: "15",
      title: "Smart Contract Security Checklist",
      description: "Essential security checklist for Solidity smart contracts. Covers common vulnerabilities, best practices, and audit preparation.",
      type: "guide",
      category: "Web3",
      format: "PDF",
      size: "1.2 MB",
      downloads: 654,
      featured: false,
      tags: ["Solidity", "Security", "Smart Contracts", "Audit"],
      downloadUrl: "/downloads/smart-contract-security.pdf",
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide": return FileText;
      case "template": return Code;
      case "asset": return ImageIcon;
      case "tool": return Package;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "guide": return "bg-blue-500/10 text-blue-400 border-blue-400/30";
      case "template": return "bg-green-500/10 text-green-400 border-green-400/30";
      case "asset": return "bg-red-500/10 text-red-400 border-red-400/30";
      case "tool": return "bg-amber-500/10 text-amber-400 border-amber-400/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-400/30";
    }
  };

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredResources = filteredResources.filter((r) => r.featured);
  const guideResources = filteredResources.filter((r) => r.type === "guide");
  const templateResources = filteredResources.filter((r) => r.type === "template");
  const assetResources = filteredResources.filter((r) => r.type === "asset");
  const toolResources = filteredResources.filter((r) => r.type === "tool");

  const renderResourceCard = (resource: Resource) => {
    const TypeIcon = getTypeIcon(resource.type);

    return (
      <Card key={resource.id} className="border-border/30 hover:border-aethex-400/50 transition-all group">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getTypeColor(resource.type)}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {resource.format}
                </Badge>
                {resource.featured && (
                  <Badge className="bg-gold-500/10 text-gold-400 border-gold-400/30">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-aethex-400 transition-colors">
                {resource.title}
              </CardTitle>
            </div>
          </div>
          <CardDescription>{resource.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ArrowDownToLine className="h-4 w-4" />
                <span>{resource.downloads.toLocaleString()}</span>
              </div>
              <span>•</span>
              <span>{resource.size}</span>
            </div>
            <div className="flex gap-2">
              {resource.previewUrl && (
                <Button variant="outline" size="sm" className="border-aethex-500/50">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
              <Button size="sm" className="bg-gradient-to-r from-aethex-500 to-gold-500">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <SEO
        pageTitle="Resource Library"
        description="Download free workforce development resources - guides, templates, and digital literacy materials from the AeThex Foundation"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          {/* Header */}
          <section className="space-y-4">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Downloads & Resources
            </Badge>
            <h1 className="text-4xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 via-amber-400 to-gold-500 bg-clip-text text-transparent">
                Resource Library
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Free, open-source resources to accelerate your workforce development and digital literacy journey
            </p>
          </section>

          {/* Search */}
          <section>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Folder className="h-6 w-6 text-aethex-400" />
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {resourceCategories.map((category) => {
                const getCategoryIcon = () => {
                  switch (category.icon) {
                    case "book": return BookOpen;
                    case "code": return Code;
                    case "folder": return Folder;
                    case "file": return FileText;
                    case "image": return ImageIcon;
                    case "video": return Video;
                    default: return Package;
                  }
                };
                const CategoryIcon = getCategoryIcon();
                const colorClass = category.color === "red" 
                  ? "from-red-500/20 to-red-600/20 border-red-500/30 hover:border-red-400/50" 
                  : category.color === "gold"
                  ? "from-gold-500/20 to-gold-600/20 border-gold-500/30 hover:border-gold-400/50"
                  : "from-amber-500/20 to-amber-600/20 border-amber-500/30 hover:border-amber-400/50";
                const iconColor = category.color === "red" ? "text-red-400" 
                  : category.color === "gold" ? "text-gold-400" : "text-amber-400";

                return (
                  <Card 
                    key={category.id} 
                    className={`border bg-gradient-to-br ${colorClass} hover:scale-105 transition-all cursor-pointer`}
                  >
                    <CardContent className="pt-6 text-center">
                      <CategoryIcon className={`h-8 w-8 ${iconColor} mx-auto mb-2`} />
                      <p className="font-semibold text-sm mb-1">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.count} items</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Featured Resources Banner */}
          <section className="bg-gradient-to-r from-red-950/30 to-gold-950/30 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-gold-400" />
              <h2 className="text-xl font-bold">Popular This Month</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredResourcesData.map((resource) => (
                <Card key={resource.id} className="border-border/30 bg-black/20">
                  <CardContent className="pt-4">
                    <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30 mb-2">
                      {resource.type}
                    </Badge>
                    <h3 className="font-semibold text-sm mb-1">{resource.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ArrowDownToLine className="h-3 w-3" />
                        {resource.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-gold-400">
                        <Star className="h-3 w-3 fill-gold-400" />
                        {resource.rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="border-border/30">
              <CardContent className="pt-6 text-center">
                <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{guideResources.length}</p>
                <p className="text-sm text-muted-foreground">Guides</p>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6 text-center">
                <Code className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{templateResources.length}</p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6 text-center">
                <ImageIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{assetResources.length}</p>
                <p className="text-sm text-muted-foreground">Assets</p>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6 text-center">
                <Package className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{toolResources.length}</p>
                <p className="text-sm text-muted-foreground">Tools</p>
              </CardContent>
            </Card>
          </section>

          {/* Resource Tabs */}
          <Tabs defaultValue="featured" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl">
              <TabsTrigger value="featured">
                <Star className="h-4 w-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-6">
              {featuredResources.map(renderResourceCard)}
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              {guideResources.map(renderResourceCard)}
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              {templateResources.map(renderResourceCard)}
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              {assetResources.map(renderResourceCard)}
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              {toolResources.map(renderResourceCard)}
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <section className="bg-gradient-to-r from-aethex-500/10 to-gold-500/10 rounded-xl p-8 border border-aethex-400/20 text-center">
            <Package className="h-12 w-12 text-aethex-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Have a resource to share?</h2>
            <p className="text-muted-foreground mb-6">
              Contribute your educational resources to help learners in our community
            </p>
            <Button className="bg-gradient-to-r from-aethex-500 to-gold-500">
              Submit Resource
            </Button>
          </section>
        </div>
      </Layout>
    </>
  );
}
