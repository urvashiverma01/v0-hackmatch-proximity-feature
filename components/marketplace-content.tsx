'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { mockDb } from '@/lib/mock-data';
import { findMatches, MatchResult } from '@/lib/matching-algorithm';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe,
  Filter,
  SortAsc,
  UserPlus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchSuccessModal } from './match-success-modal';

export function MarketplaceContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState(100);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [matchModal, setMatchModal] = useState<{ isOpen: boolean; user: MatchResult['user'] | null }>({
    isOpen: false,
    user: null
  });

  const allUsers = mockDb.getAllUsers();
  
  const filteredMatches = useMemo(() => {
    if (!user) return [];
    
    let matches = findMatches(user, allUsers, {
      maxDistance: maxDistance < 100 ? maxDistance : undefined,
      sortByProximity
    });

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      matches = matches.filter(m => 
        m.user.name.toLowerCase().includes(term) ||
        m.user.skills.some(s => s.toLowerCase().includes(term)) ||
        m.user.interests.some(i => i.toLowerCase().includes(term)) ||
        m.user.bio.toLowerCase().includes(term)
      );
    }

    // Filter by skills
    if (selectedSkills.length > 0) {
      matches = matches.filter(m =>
        selectedSkills.some(skill => m.user.skills.includes(skill))
      );
    }

    // Filter by interests
    if (selectedInterests.length > 0) {
      matches = matches.filter(m =>
        selectedInterests.some(interest => m.user.interests.includes(interest))
      );
    }

    return matches;
  }, [user, allUsers, searchTerm, selectedSkills, selectedInterests, maxDistance, sortByProximity]);

  const handleConnect = (targetUser: MatchResult['user']) => {
    if (!user) return;
    
    const isMatch = mockDb.addConnection(user.id, targetUser.id);
    setConnectedUsers(prev => [...prev, targetUser.id]);
    
    if (isMatch) {
      setMatchModal({ isOpen: true, user: targetUser });
    }
  };

  const uniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    allUsers.forEach(u => u.skills.forEach(s => skills.add(s)));
    return Array.from(skills).sort();
  }, [allUsers]);

  const uniqueInterests = useMemo(() => {
    const interests = new Set<string>();
    allUsers.forEach(u => u.interests.forEach(i => interests.add(i)));
    return Array.from(interests).sort();
  }, [allUsers]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-mono flex items-center gap-2">
          <span className="text-terminal">&gt;</span> Marketplace
        </h1>
        <p className="text-muted-foreground font-mono mt-1">
          Discover and connect with potential teammates
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-mono bg-input border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortByProximity ? "default" : "outline"}
                onClick={() => setSortByProximity(!sortByProximity)}
                className="font-mono"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Proximity
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="font-mono"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="pt-4 border-t border-border space-y-4 animate-fade-in-up">
              {/* Distance Slider */}
              <div className="space-y-2">
                <Label className="font-mono text-sm flex items-center justify-between">
                  <span>Max Distance: {maxDistance < 100 ? `${maxDistance} km` : 'Any'}</span>
                  <SortAsc className="w-4 h-4 text-muted-foreground" />
                </Label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={([value]) => setMaxDistance(value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Skills Filter */}
              <div className="space-y-2">
                <Label className="font-mono text-sm">Filter by Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {uniqueSkills.slice(0, 12).map(skill => (
                    <Button
                      key={skill}
                      size="sm"
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      onClick={() => setSelectedSkills(prev =>
                        prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
                      )}
                      className="font-mono text-xs"
                    >
                      {selectedSkills.includes(skill) && <Check className="w-3 h-3 mr-1" />}
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Interests Filter */}
              <div className="space-y-2">
                <Label className="font-mono text-sm">Filter by Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {uniqueInterests.map(interest => (
                    <Button
                      key={interest}
                      size="sm"
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      onClick={() => setSelectedInterests(prev =>
                        prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
                      )}
                      className="font-mono text-xs"
                    >
                      {selectedInterests.includes(interest) && <Check className="w-3 h-3 mr-1" />}
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedSkills.length > 0 || selectedInterests.length > 0 || maxDistance < 100) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSkills([]);
                    setSelectedInterests([]);
                    setMaxDistance(100);
                  }}
                  className="font-mono text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-mono">
          <span className="text-terminal">&gt;</span> Found <span className="text-primary">{filteredMatches.length}</span> potential teammates
        </p>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map((match, index) => (
          <UserCard
            key={match.user.id}
            match={match}
            isConnected={connectedUsers.includes(match.user.id)}
            onConnect={() => handleConnect(match.user)}
            delay={index * 50}
          />
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-mono">
            <span className="text-terminal">&gt;</span> No matches found. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Match Success Modal */}
      <MatchSuccessModal
        isOpen={matchModal.isOpen}
        onClose={() => setMatchModal({ isOpen: false, user: null })}
        matchedUser={matchModal.user}
      />
    </div>
  );
}

function UserCard({ 
  match, 
  isConnected, 
  onConnect,
  delay 
}: { 
  match: MatchResult; 
  isConnected: boolean;
  onConnect: () => void;
  delay: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { user } = match;

  return (
    <Card 
      className="bg-card/80 backdrop-blur-sm border-border/50 card-glow overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-0">
        {/* Header with avatar and compatibility */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-14 h-14 border-2 border-primary/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/20 text-primary font-mono text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-mono font-semibold">{user.name}</h3>
                {user.distance && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {user.distance.toFixed(1)} km away
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold font-mono text-primary">
                  {match.compatibilityScore}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">match</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Bio */}
          <p className={cn(
            "text-sm text-muted-foreground",
            !expanded && "line-clamp-2"
          )}>
            {user.bio}
          </p>

          {/* Skills */}
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, expanded ? undefined : 4).map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs font-mono">
                  {skill}
                </Badge>
              ))}
              {!expanded && user.skills.length > 4 && (
                <Badge variant="outline" className="text-xs font-mono">
                  +{user.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Interests */}
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Interests</p>
            <div className="flex flex-wrap gap-1">
              {user.interests.slice(0, expanded ? undefined : 3).map(interest => (
                <Badge key={interest} className="text-xs font-mono bg-accent/20 text-accent-foreground border-accent/30">
                  {interest}
                </Badge>
              ))}
              {!expanded && user.interests.length > 3 && (
                <Badge variant="outline" className="text-xs font-mono">
                  +{user.interests.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Expanded content */}
          {expanded && (
            <div className="pt-3 border-t border-border/50 space-y-3 animate-fade-in-up">
              {/* Match Reasons */}
              {match.matchReasons.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-2">Why you match</p>
                  <ul className="space-y-1">
                    {match.matchReasons.map((reason, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-terminal">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compatibility Breakdown */}
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">Compatibility</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold font-mono text-primary">{match.breakdown.skillsScore}%</p>
                    <p className="text-xs text-muted-foreground">Skills</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold font-mono text-accent">{match.breakdown.interestsScore}%</p>
                    <p className="text-xs text-muted-foreground">Interests</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold font-mono text-terminal">{match.breakdown.workStyleScore}%</p>
                    <p className="text-xs text-muted-foreground">Style</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(user.github || user.linkedin || user.portfolio) && (
                <div className="flex gap-2">
                  {user.github && (
                    <Button variant="outline" size="sm" className="font-mono" asChild>
                      <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {user.linkedin && (
                    <Button variant="outline" size="sm" className="font-mono" asChild>
                      <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {user.portfolio && (
                    <Button variant="outline" size="sm" className="font-mono" asChild>
                      <a href={`https://${user.portfolio}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="font-mono text-xs"
            >
              {expanded ? 'Show Less' : 'Show More'}
            </Button>
            <Button
              size="sm"
              onClick={onConnect}
              disabled={isConnected}
              className={cn(
                "font-mono text-xs ml-auto",
                isConnected 
                  ? "bg-terminal text-terminal-foreground" 
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {isConnected ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1" />
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
