'use client';

import { useAuth } from '@/contexts/auth-context';
import { mockDb } from '@/lib/mock-data';
import { findMatches } from '@/lib/matching-algorithm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart, 
  Zap, 
  MapPin, 
  TrendingUp, 
  Code2,
  MessageSquare,
  Activity,
  Terminal
} from 'lucide-react';
import Link from 'next/link';

export function DashboardContent() {
  const { user } = useAuth();
  
  if (!user) return null;

  const allUsers = mockDb.getAllUsers();
  const matches = findMatches(user, allUsers);
  const topMatches = matches.slice(0, 3);
  
  const stats = {
    profileViews: Math.floor(Math.random() * 50) + 20,
    connectionsThisWeek: user.connections.length + Math.floor(Math.random() * 5),
    matchRate: Math.floor(Math.random() * 30) + 60,
    pendingRequests: user.pendingConnections.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono flex items-center gap-2">
            <span className="text-terminal">&gt;</span> Dashboard
          </h1>
          <p className="text-muted-foreground font-mono mt-1">
            Welcome back, <span className="text-primary">{user.name.split(' ')[0]}</span>
            <span className="animate-blink">_</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="font-mono bg-primary hover:bg-primary/90">
            <Link href="/swipe">
              <Heart className="w-4 h-4 mr-2" />
              Start Swiping
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Profile Views"
          value={stats.profileViews}
          change="+12%"
          icon={<Activity className="w-5 h-5" />}
          trend="up"
        />
        <StatsCard
          title="Connections"
          value={stats.connectionsThisWeek}
          change="+3 this week"
          icon={<Users className="w-5 h-5" />}
          trend="up"
        />
        <StatsCard
          title="Match Rate"
          value={`${stats.matchRate}%`}
          change="Above average"
          icon={<Heart className="w-5 h-5" />}
          trend="up"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingRequests}
          change="requests"
          icon={<MessageSquare className="w-5 h-5" />}
          trend="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-mono flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Top Matches
                </CardTitle>
                <CardDescription className="font-mono">
                  Highest compatibility teammates
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="font-mono">
                <Link href="/find-teammates">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topMatches.map((match, index) => (
              <div 
                key={match.user.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarImage src={match.user.avatar} alt={match.user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-mono">
                      {match.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-medium">{match.user.name}</p>
                    {match.user.distance && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {match.user.distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {match.user.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs font-mono">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-primary">
                    {match.compatibilityScore}%
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">match</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2 text-lg">
                <Terminal className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction 
                href="/marketplace" 
                icon={<Users className="w-4 h-4" />}
                label="Browse Marketplace"
              />
              <QuickAction 
                href="/swipe" 
                icon={<Heart className="w-4 h-4" />}
                label="Swipe Mode"
              />
              <QuickAction 
                href="/find-teammates" 
                icon={<Zap className="w-4 h-4" />}
                label="Find Teammates"
              />
              <QuickAction 
                href="/profile" 
                icon={<Code2 className="w-4 h-4" />}
                label="Edit Profile"
              />
            </CardContent>
          </Card>

          {/* Your Skills */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2 text-lg">
                <Code2 className="w-5 h-5 text-primary" />
                Your Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <Badge key={skill} variant="outline" className="font-mono text-xs border-primary/30">
                    {skill}
                  </Badge>
                ))}
                {user.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground font-mono">
                    No skills added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => (
                  <Badge key={interest} className="font-mono text-xs bg-accent/20 text-accent-foreground border-accent/30">
                    {interest}
                  </Badge>
                ))}
                {user.interests.length === 0 && (
                  <p className="text-sm text-muted-foreground font-mono">
                    No interests added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  change: string; 
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 card-glow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div className={`text-xs font-mono ${
            trend === 'up' ? 'text-terminal' : 
            trend === 'down' ? 'text-destructive' : 
            'text-muted-foreground'
          }`}>
            {change}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold font-mono">{value}</p>
          <p className="text-sm text-muted-foreground font-mono">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-primary/30 transition-all font-mono text-sm group"
    >
      <div className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="group-hover:text-foreground transition-colors">{label}</span>
      <span className="ml-auto text-muted-foreground/50 group-hover:text-primary/50">&gt;</span>
    </Link>
  );
}
