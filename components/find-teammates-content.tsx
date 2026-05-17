'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { mockDb } from '@/lib/mock-data';
import { findMatches, MatchResult } from '@/lib/matching-algorithm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  MapPin, 
  UserPlus,
  Check,
  Filter,
  ArrowUpDown,
  Target,
  Brain,
  Code2,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchSuccessModal } from './match-success-modal';

export function FindTeammatesContent() {
  const { user } = useAuth();
  const [minCompatibility, setMinCompatibility] = useState(30);
  const [maxDistance, setMaxDistance] = useState(100);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [matchModal, setMatchModal] = useState<{ isOpen: boolean; user: MatchResult['user'] | null }>({
    isOpen: false,
    user: null
  });

  const allUsers = mockDb.getAllUsers();

  const filteredMatches = useMemo(() => {
    if (!user) return [];
    
    return findMatches(user, allUsers, {
      maxDistance: maxDistance < 100 ? maxDistance : undefined,
      sortByProximity,
      minCompatibility
    });
  }, [user, allUsers, maxDistance, sortByProximity, minCompatibility]);

  const handleConnect = (targetUser: MatchResult['user']) => {
    if (!user) return;
    
    const isMatch = mockDb.addConnection(user.id, targetUser.id);
    setConnectedUsers(prev => [...prev, targetUser.id]);
    
    if (isMatch) {
      setMatchModal({ isOpen: true, user: targetUser });
    }
  };

  if (!user) return null;

  // Get compatibility distribution for stats
  const compatibilityBuckets = useMemo(() => {
    const buckets = { high: 0, medium: 0, low: 0 };
    filteredMatches.forEach(m => {
      if (m.compatibilityScore >= 70) buckets.high++;
      else if (m.compatibilityScore >= 50) buckets.medium++;
      else buckets.low++;
    });
    return buckets;
  }, [filteredMatches]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-mono flex items-center gap-2">
          <span className="text-terminal">&gt;</span> Find Teammates
        </h1>
        <p className="text-muted-foreground font-mono mt-1">
          AI-powered matching based on your profile
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 sticky top-6">
            <CardHeader>
              <CardTitle className="font-mono text-lg flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Min Compatibility */}
              <div className="space-y-3">
                <Label className="font-mono text-sm flex items-center justify-between">
                  <span>Min Compatibility</span>
                  <span className="text-primary">{minCompatibility}%</span>
                </Label>
                <Slider
                  value={[minCompatibility]}
                  onValueChange={([value]) => setMinCompatibility(value)}
                  min={0}
                  max={90}
                  step={10}
                />
              </div>

              {/* Max Distance */}
              <div className="space-y-3">
                <Label className="font-mono text-sm flex items-center justify-between">
                  <span>Max Distance</span>
                  <span className="text-primary">{maxDistance < 100 ? `${maxDistance} km` : 'Any'}</span>
                </Label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={([value]) => setMaxDistance(value)}
                  max={100}
                  step={5}
                />
              </div>

              {/* Sort by Proximity */}
              <div className="flex items-center justify-between">
                <Label htmlFor="proximity" className="font-mono text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Sort by Proximity
                </Label>
                <Switch
                  id="proximity"
                  checked={sortByProximity}
                  onCheckedChange={setSortByProximity}
                />
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-xs font-mono text-muted-foreground">Match Distribution</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-terminal">High ({'>'}70%)</span>
                    <span className="font-mono font-bold">{compatibilityBuckets.high}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-primary">Medium (50-70%)</span>
                    <span className="font-mono font-bold">{compatibilityBuckets.medium}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground">Low ({'<'}50%)</span>
                    <span className="font-mono font-bold">{compatibilityBuckets.low}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-mono">
              <span className="text-terminal">&gt;</span> Found <span className="text-primary">{filteredMatches.length}</span> compatible teammates
            </p>
            <Button variant="outline" size="sm" className="font-mono" onClick={() => setSortByProximity(!sortByProximity)}>
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortByProximity ? 'By Distance' : 'By Match %'}
            </Button>
          </div>

          {/* Match Cards */}
          <div className="space-y-4">
            {filteredMatches.map((match, index) => (
              <MatchCard
                key={match.user.id}
                match={match}
                isConnected={connectedUsers.includes(match.user.id)}
                onConnect={() => handleConnect(match.user)}
                rank={index + 1}
              />
            ))}
          </div>

          {filteredMatches.length === 0 && (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="py-12 text-center">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-mono">
                  No matches found with current filters.
                  <br />
                  Try lowering the minimum compatibility.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Match Success Modal */}
      <MatchSuccessModal
        isOpen={matchModal.isOpen}
        onClose={() => setMatchModal({ isOpen: false, user: null })}
        matchedUser={matchModal.user}
      />
    </div>
  );
}

function MatchCard({ 
  match, 
  isConnected, 
  onConnect,
  rank
}: { 
  match: MatchResult; 
  isConnected: boolean;
  onConnect: () => void;
  rank: number;
}) {
  const { user } = match;

  const getCompatibilityColor = (score: number) => {
    if (score >= 70) return 'text-terminal';
    if (score >= 50) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 card-glow overflow-hidden animate-fade-in-up hover:border-primary/30 transition-colors">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left: Avatar and main info */}
          <div className="flex-1 p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-primary/30">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-mono text-xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono",
                  rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  #{rank}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-mono font-semibold text-lg">{user.name}</h3>
                  {user.distance && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {user.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.skills.slice(0, 5).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs font-mono">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs font-mono">
                      +{user.skills.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Match Reasons */}
            {match.matchReasons.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs font-mono text-muted-foreground mb-2">Why you match:</p>
                <div className="flex flex-wrap gap-2">
                  {match.matchReasons.slice(0, 3).map((reason, i) => (
                    <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Compatibility breakdown and action */}
          <div className="md:w-64 p-6 bg-muted/20 border-t md:border-t-0 md:border-l border-border/50 flex flex-col justify-between">
            {/* Main score */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2">
                <Zap className={cn("w-6 h-6", getCompatibilityColor(match.compatibilityScore))} />
                <span className={cn("text-4xl font-bold font-mono", getCompatibilityColor(match.compatibilityScore))}>
                  {match.compatibilityScore}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1">Compatibility Score</p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Code2 className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-sm font-bold font-mono">{match.breakdown.skillsScore}%</p>
                <p className="text-xs text-muted-foreground">Skills</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Lightbulb className="w-4 h-4 mx-auto text-accent mb-1" />
                <p className="text-sm font-bold font-mono">{match.breakdown.interestsScore}%</p>
                <p className="text-xs text-muted-foreground">Interest</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Brain className="w-4 h-4 mx-auto text-terminal mb-1" />
                <p className="text-sm font-bold font-mono">{match.breakdown.workStyleScore}%</p>
                <p className="text-xs text-muted-foreground">Style</p>
              </div>
            </div>

            {/* Connect Button */}
            <Button
              onClick={onConnect}
              disabled={isConnected}
              className={cn(
                "w-full font-mono",
                isConnected 
                  ? "bg-terminal/20 text-terminal border border-terminal/30" 
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {isConnected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Request Sent
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
