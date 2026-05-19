"use client"

import { useState } from "react"
import { 
  Database, 
  Users, 
  Layout, 
  Layers, 
  ArrowRight, 
  ArrowDown,
  Box,
  Zap,
  MapPin,
  Heart,
  Search,
  User,
  BarChart3,
  Settings,
  Lock,
  FileCode,
  Workflow
} from "lucide-react"

export default function ArchitecturePage() {
  const [activeView, setActiveView] = useState<"overview" | "components" | "dataflow" | "features">("overview")

  return (
    <div className="min-h-screen bg-background p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            <span className="text-primary">{">"}</span> HackMatch Architecture
          </h1>
          <p className="text-muted-foreground">System Design & Component Structure</p>
        </div>

        {/* View Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "overview", label: "System Overview" },
            { id: "components", label: "Component Tree" },
            { id: "dataflow", label: "Data Flow" },
            { id: "features", label: "Feature Modules" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                activeView === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* System Overview */}
        {activeView === "overview" && (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                High-Level Architecture
              </h2>
              
              <div className="flex flex-col items-center gap-4">
                {/* Presentation Layer */}
                <div className="w-full max-w-4xl">
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <span className="text-primary font-bold text-lg">PRESENTATION LAYER</span>
                      <p className="text-muted-foreground text-sm">Next.js 15 + React + Tailwind CSS</p>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {["Login Page", "Dashboard", "Marketplace", "Swipe Mode", "Profile"].map((page) => (
                        <div key={page} className="bg-card border border-border rounded-lg p-3 text-center">
                          <span className="text-foreground text-sm">{page}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ArrowDown className="w-6 h-6 text-primary" />

                {/* State Management Layer */}
                <div className="w-full max-w-3xl">
                  <div className="bg-accent/20 border border-accent/30 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <span className="text-accent font-bold text-lg">STATE MANAGEMENT</span>
                      <p className="text-muted-foreground text-sm">React Context + Local State</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["AuthContext", "UserState", "MatchState"].map((ctx) => (
                        <div key={ctx} className="bg-card border border-border rounded-lg p-3 text-center">
                          <span className="text-foreground text-sm">{ctx}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ArrowDown className="w-6 h-6 text-primary" />

                {/* Business Logic Layer */}
                <div className="w-full max-w-2xl">
                  <div className="bg-chart-1/10 border border-chart-1/30 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <span className="text-chart-1 font-bold text-lg">BUSINESS LOGIC</span>
                      <p className="text-muted-foreground text-sm">Matching Algorithm + Utilities</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {["matching-algorithm.ts", "mock-data.ts"].map((file) => (
                        <div key={file} className="bg-card border border-border rounded-lg p-3 text-center">
                          <span className="text-foreground text-sm font-mono">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ArrowDown className="w-6 h-6 text-primary" />

                {/* Data Layer */}
                <div className="w-full max-w-xl">
                  <div className="bg-chart-2/10 border border-chart-2/30 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <span className="text-chart-2 font-bold text-lg">DATA LAYER</span>
                      <p className="text-muted-foreground text-sm">Mock Database + localStorage</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      <div className="bg-card border border-border rounded-lg p-3 text-center">
                        <Database className="w-5 h-5 text-chart-2 mx-auto mb-1" />
                        <span className="text-foreground text-sm">15 Mock Users</span>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-3 text-center">
                        <Lock className="w-5 h-5 text-chart-2 mx-auto mb-1" />
                        <span className="text-foreground text-sm">JWT Tokens</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Tech Stack</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: "Next.js 15", desc: "React Framework", color: "primary" },
                  { name: "TypeScript", desc: "Type Safety", color: "chart-1" },
                  { name: "Tailwind CSS", desc: "Styling", color: "chart-2" },
                  { name: "Lucide Icons", desc: "Icon Library", color: "accent" },
                  { name: "React Context", desc: "State Management", color: "primary" },
                  { name: "localStorage", desc: "Persistence", color: "chart-1" },
                  { name: "Geolocation API", desc: "Proximity", color: "chart-2" },
                  { name: "shadcn/ui", desc: "UI Components", color: "accent" },
                ].map((tech) => (
                  <div key={tech.name} className="bg-muted/30 border border-border rounded-lg p-4 text-center">
                    <span className={`text-${tech.color} font-bold`}>{tech.name}</span>
                    <p className="text-muted-foreground text-sm mt-1">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Component Tree */}
        {activeView === "components" && (
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              Component Hierarchy
            </h2>
            
            <div className="font-mono text-sm">
              <div className="space-y-1">
                <TreeNode level={0} name="app/" type="folder" />
                <TreeNode level={1} name="layout.tsx" type="file" desc="Root layout with AuthProvider" />
                <TreeNode level={1} name="page.tsx" type="file" desc="Login/Register page" />
                <TreeNode level={1} name="globals.css" type="file" desc="Global styles & CSS variables" />
                <TreeNode level={1} name="dashboard/" type="folder" />
                <TreeNode level={2} name="page.tsx" type="file" desc="Dashboard with stats" />
                <TreeNode level={1} name="marketplace/" type="folder" />
                <TreeNode level={2} name="page.tsx" type="file" desc="Browse all users" />
                <TreeNode level={1} name="find-teammates/" type="folder" />
                <TreeNode level={2} name="page.tsx" type="file" desc="AI matching results" />
                <TreeNode level={1} name="swipe/" type="folder" />
                <TreeNode level={2} name="page.tsx" type="file" desc="Tinder-style cards" />
                <TreeNode level={1} name="profile/" type="folder" />
                <TreeNode level={2} name="page.tsx" type="file" desc="Edit user profile" />
                
                <div className="mt-6" />
                <TreeNode level={0} name="components/" type="folder" />
                <TreeNode level={1} name="app-shell.tsx" type="component" desc="Navigation wrapper" />
                <TreeNode level={1} name="onboarding-wizard.tsx" type="component" desc="4-step quiz" />
                <TreeNode level={1} name="dashboard-content.tsx" type="component" desc="Stats & matches" />
                <TreeNode level={1} name="marketplace-content.tsx" type="component" desc="User grid + filters" />
                <TreeNode level={1} name="find-teammates-content.tsx" type="component" desc="Compatibility cards" />
                <TreeNode level={1} name="swipe-content.tsx" type="component" desc="Card stack + animations" />
                <TreeNode level={1} name="profile-content.tsx" type="component" desc="Edit form" />
                <TreeNode level={1} name="match-success-modal.tsx" type="component" desc="Celebration popup" />
                <TreeNode level={1} name="ui/" type="folder" desc="shadcn/ui components" />
                
                <div className="mt-6" />
                <TreeNode level={0} name="contexts/" type="folder" />
                <TreeNode level={1} name="auth-context.tsx" type="context" desc="User auth state" />
                
                <div className="mt-6" />
                <TreeNode level={0} name="lib/" type="folder" />
                <TreeNode level={1} name="mock-data.ts" type="data" desc="15 fake user profiles" />
                <TreeNode level={1} name="matching-algorithm.ts" type="logic" desc="Compatibility scoring" />
              </div>
            </div>
          </div>
        )}

        {/* Data Flow */}
        {activeView === "dataflow" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-primary" />
                User Authentication Flow
              </h2>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <FlowBox icon={User} label="User" sublabel="Enter credentials" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Lock} label="Auth" sublabel="Validate & JWT" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Database} label="Storage" sublabel="localStorage" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Layout} label="Dashboard" sublabel="Redirect" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Matching Algorithm Flow
              </h2>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <FlowBox icon={User} label="Current User" sublabel="Quiz data" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Users} label="All Users" sublabel="Mock DB" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Zap} label="Algorithm" sublabel="Score calc" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={BarChart3} label="Results" sublabel="Sorted matches" />
              </div>

              <div className="mt-8 bg-muted/30 rounded-lg p-6">
                <h3 className="text-foreground font-bold mb-4">Compatibility Score Formula</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <span className="text-primary text-2xl font-bold">40%</span>
                    <p className="text-muted-foreground text-sm mt-1">Skills Match</p>
                    <p className="text-xs text-muted-foreground">Complementary weighted</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <span className="text-accent text-2xl font-bold">35%</span>
                    <p className="text-muted-foreground text-sm mt-1">Shared Interests</p>
                    <p className="text-xs text-muted-foreground">Common passions</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <span className="text-chart-1 text-2xl font-bold">25%</span>
                    <p className="text-muted-foreground text-sm mt-1">Work Style</p>
                    <p className="text-xs text-muted-foreground">Schedule & role fit</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Proximity Feature Flow
              </h2>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <FlowBox icon={MapPin} label="Geolocation" sublabel="Browser API" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={User} label="User Coords" sublabel="lat/lng" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Zap} label="Distance Calc" sublabel="Haversine" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Search} label="Sort/Filter" sublabel="Max distance" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Swipe & Match Flow
              </h2>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <FlowBox icon={Users} label="Card Stack" sublabel="Potential matches" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Heart} label="Swipe Right" sublabel="Like user" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Database} label="Check" sublabel="Mutual like?" />
                <ArrowRight className="w-6 h-6 text-primary" />
                <FlowBox icon={Zap} label="Match!" sublabel="Celebration" />
              </div>
            </div>
          </div>
        )}

        {/* Feature Modules */}
        {activeView === "features" && (
          <div className="grid grid-cols-2 gap-6">
            <FeatureCard
              icon={Lock}
              title="Authentication"
              features={[
                "Email/password login & register",
                "JWT token generation",
                "Session persistence",
                "Demo quick-login button"
              ]}
              files={["app/page.tsx", "contexts/auth-context.tsx"]}
            />
            
            <FeatureCard
              icon={Settings}
              title="Onboarding Wizard"
              features={[
                "Step 1: Technical skills (multi-select)",
                "Step 2: Project interests",
                "Step 3: Work style preferences",
                "Step 4: Location & bio"
              ]}
              files={["components/onboarding-wizard.tsx"]}
            />
            
            <FeatureCard
              icon={BarChart3}
              title="Dashboard"
              features={[
                "Profile view stats",
                "Connection metrics",
                "Top 3 matches preview",
                "Quick action links"
              ]}
              files={["components/dashboard-content.tsx"]}
            />
            
            <FeatureCard
              icon={Search}
              title="Marketplace"
              features={[
                "Search by name/skills",
                "Filter by skills & interests",
                "Proximity sorting",
                "Max distance slider"
              ]}
              files={["components/marketplace-content.tsx"]}
            />
            
            <FeatureCard
              icon={Zap}
              title="AI Matching"
              features={[
                "Complementary skills scoring",
                "Shared interests weighting",
                "Work style compatibility",
                "Combined proximity score"
              ]}
              files={["lib/matching-algorithm.ts", "components/find-teammates-content.tsx"]}
            />
            
            <FeatureCard
              icon={Heart}
              title="Swipe Mode"
              features={[
                "Tinder-style card stack",
                "Swipe animations",
                "Undo functionality",
                "Match celebration modal"
              ]}
              files={["components/swipe-content.tsx", "components/match-success-modal.tsx"]}
            />
            
            <FeatureCard
              icon={MapPin}
              title="Proximity Feature"
              features={[
                "Browser geolocation API",
                "Distance calculation",
                "Sort by proximity toggle",
                "Max distance filter"
              ]}
              files={["components/onboarding-wizard.tsx", "lib/mock-data.ts"]}
            />
            
            <FeatureCard
              icon={User}
              title="Profile Management"
              features={[
                "Edit all profile fields",
                "Add/remove skills",
                "Update work preferences",
                "Toggle location sharing"
              ]}
              files={["components/profile-content.tsx"]}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>HackMatch - Hackathon Team Matching Platform</p>
          <p className="mt-1">Built with Next.js 15 + React + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

function TreeNode({ 
  level, 
  name, 
  type, 
  desc 
}: { 
  level: number
  name: string
  type: "folder" | "file" | "component" | "context" | "data" | "logic"
  desc?: string 
}) {
  const indent = "│   ".repeat(level)
  const prefix = level > 0 ? "├── " : ""
  
  const colors = {
    folder: "text-chart-1",
    file: "text-muted-foreground",
    component: "text-primary",
    context: "text-accent",
    data: "text-chart-2",
    logic: "text-chart-1"
  }

  const icons = {
    folder: "📁",
    file: "📄",
    component: "⚛️",
    context: "🔄",
    data: "💾",
    logic: "⚡"
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-border">{indent}{prefix}</span>
      <span>{icons[type]}</span>
      <span className={colors[type]}>{name}</span>
      {desc && <span className="text-muted-foreground/60 text-xs ml-2">// {desc}</span>}
    </div>
  )
}

function FlowBox({ 
  icon: Icon, 
  label, 
  sublabel 
}: { 
  icon: React.ElementType
  label: string
  sublabel: string 
}) {
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4 text-center min-w-[120px]">
      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
      <p className="text-foreground font-medium">{label}</p>
      <p className="text-muted-foreground text-xs">{sublabel}</p>
    </div>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  features, 
  files 
}: { 
  icon: React.ElementType
  title: string
  features: string[]
  files: string[]
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      
      <ul className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <li key={i} className="text-muted-foreground text-sm flex items-center gap-2">
            <span className="text-primary">{">"}</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <div className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground mb-2">Related files:</p>
        <div className="flex flex-wrap gap-1">
          {files.map((file, i) => (
            <span key={i} className="text-xs bg-muted/50 px-2 py-1 rounded font-mono text-primary">
              {file}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
