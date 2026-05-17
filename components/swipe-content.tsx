'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { mockDb } from '@/lib/mock-data';
import { findMatches, MatchResult } from '@/lib/matching-algorithm';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  X, 
  MapPin, 
  RotateCcw,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchSuccessModal } from './match-success-modal';

export function SwipeContent() {
  const { user } = useAuth();
  const allUsers = mockDb.getAllUsers();
  
  const [matches] = useState<MatchResult[]>(() => 
    user ? findMatches(user, allUsers) : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedUsers, setSwipedUsers] = useState<{id: string; liked: boolean}[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [matchModal, setMatchModal] = useState<{ isOpen: boolean; user: MatchResult['user'] | null }>({
    isOpen: false,
    user: null
  });

  const currentMatch = matches[currentIndex];
  const remainingCount = matches.length - currentIndex - 1;

  const handleSwipe = useCallback((liked: boolean) => {
    if (isAnimating || !currentMatch || !user) return;

    setIsAnimating(true);
    setSwipeDirection(liked ? 'right' : 'left');

    setTimeout(() => {
      setSwipedUsers(prev => [...prev, { id: currentMatch.user.id, liked }]);
      
      if (liked) {
        const isMatch = mockDb.addConnection(user.id, currentMatch.user.id);
        if (isMatch) {
          setMatchModal({ isOpen: true, user: currentMatch.user });
        }
      }

      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  }, [currentMatch, isAnimating, user]);

  const handleUndo = () => {
    if (swipedUsers.length === 0 || isAnimating) return;
    
    setCurrentIndex(prev => prev - 1);
    setSwipedUsers(prev => prev.slice(0, -1));
  };

  if (!user) return null;

  const likedCount = swipedUsers.filter(s => s.liked).length;
  const passedCount = swipedUsers.filter(s => !s.liked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono flex items-center gap-2">
            <span className="text-terminal">&gt;</span> Swipe Mode
          </h1>
          <p className="text-muted-foreground font-mono mt-1">
            Find your perfect teammate with a swipe
          </p>
        </div>
        <div className="flex gap-4 font-mono text-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>{likedCount} liked</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-muted-foreground" />
            <span>{passedCount} passed</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>{remainingCount} remaining</span>
          </div>
        </div>
      </div>

      {/* Swipe Area */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          {currentMatch ? (
            <>
              {/* Card Stack Effect */}
              {matches.slice(currentIndex + 1, currentIndex + 3).map((match, i) => (
                <div
                  key={match.user.id}
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${1 - (i + 1) * 0.05}) translateY(${(i + 1) * 10}px)`,
                    zIndex: -i - 1,
                    opacity: 1 - (i + 1) * 0.3
                  }}
                >
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                    <CardContent className="p-6 h-full" />
                  </Card>
                </div>
              ))}

              {/* Main Card */}
              <Card 
                className={cn(
                  "bg-card/80 backdrop-blur-sm border-border/50 card-glow transition-all duration-300 cursor-grab active:cursor-grabbing",
                  swipeDirection === 'left' && "animate-swipe-left",
                  swipeDirection === 'right' && "animate-swipe-right"
                )}
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {currentIndex + 1} / {matches.length}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="text-3xl font-bold font-mono text-primary">
                          {currentMatch.compatibilityScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20 border-4 border-primary/30">
                        <AvatarImage src={currentMatch.user.avatar} alt={currentMatch.user.name} />
                        <AvatarFallback className="bg-primary/20 text-primary font-mono text-2xl">
                          {currentMatch.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold font-mono">{currentMatch.user.name}</h2>
                        {currentMatch.user.distance && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {currentMatch.user.distance.toFixed(1)} km away
                          </p>
                        )}
                        {/* Social Links */}
                        <div className="flex gap-2 mt-2">
                          {currentMatch.user.github && (
                            <a 
                              href={`https://github.com/${currentMatch.user.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {currentMatch.user.linkedin && (
                            <a 
                              href={`https://linkedin.com/in/${currentMatch.user.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {currentMatch.user.portfolio && (
                            <a 
                              href={`https://${currentMatch.user.portfolio}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-muted-foreground">{currentMatch.user.bio}</p>

                    {/* Skills */}
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.user.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="font-mono text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.user.interests.map(interest => (
                          <Badge key={interest} className="font-mono text-xs bg-accent/20 text-accent-foreground border-accent/30">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {currentMatch.matchReasons.length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-xs font-mono text-muted-foreground mb-2">Why you match</p>
                        <ul className="space-y-1">
                          {currentMatch.matchReasons.map((reason, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-terminal">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Compatibility Breakdown */}
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-xl font-bold font-mono text-primary">{currentMatch.breakdown.skillsScore}%</p>
                        <p className="text-xs text-muted-foreground">Skills</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-xl font-bold font-mono text-accent">{currentMatch.breakdown.interestsScore}%</p>
                        <p className="text-xs text-muted-foreground">Interests</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-xl font-bold font-mono text-terminal">{currentMatch.breakdown.workStyleScore}%</p>
                        <p className="text-xs text-muted-foreground">Style</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Swipe Buttons */}
              <div className="flex justify-center items-center gap-6 mt-6">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleUndo}
                  disabled={swipedUsers.length === 0 || isAnimating}
                  className="w-14 h-14 rounded-full border-border hover:border-warning hover:text-warning"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleSwipe(false)}
                  disabled={isAnimating}
                  className="w-16 h-16 rounded-full bg-destructive/20 hover:bg-destructive/30 border-2 border-destructive text-destructive"
                >
                  <X className="w-8 h-8" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleSwipe(true)}
                  disabled={isAnimating}
                  className="w-16 h-16 rounded-full bg-primary/20 hover:bg-primary/30 border-2 border-primary text-primary"
                >
                  <Heart className="w-8 h-8" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleSwipe(true)}
                  disabled={isAnimating}
                  className="w-14 h-14 rounded-full border-border hover:border-accent hover:text-accent"
                >
                  <Sparkles className="w-6 h-6" />
                </Button>
              </div>

              {/* Keyboard hints */}
              <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Pass
                </span>
                <span className="flex items-center gap-1">
                  Like <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </>
          ) : (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold font-mono mb-2">All Caught Up!</h2>
                <p className="text-muted-foreground font-mono">
                  You&apos;ve seen all available profiles.
                  <br />
                  Check back later for new matches!
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground font-mono">
                    Stats: <span className="text-primary">{likedCount}</span> liked, <span className="text-muted-foreground">{passedCount}</span> passed
                  </p>
                </div>
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

      <style jsx global>{`
        @keyframes swipe-left {
          to {
            transform: translateX(-150%) rotate(-30deg);
            opacity: 0;
          }
        }
        @keyframes swipe-right {
          to {
            transform: translateX(150%) rotate(30deg);
            opacity: 0;
          }
        }
        .animate-swipe-left {
          animation: swipe-left 0.3s ease-out forwards;
        }
        .animate-swipe-right {
          animation: swipe-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
