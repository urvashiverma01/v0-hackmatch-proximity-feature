'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Sparkles, 
  X,
  MessageCircle,
  PartyPopper
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser: UserProfile | null;
}

export function MatchSuccessModal({ isOpen, onClose, matchedUser }: MatchSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !matchedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#a855f7', '#ec4899', '#22c55e', '#3b82f6', '#f59e0b'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-bounce-in">
        <div className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
          
          <div className="relative p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <PartyPopper className="w-16 h-16 text-primary animate-bounce" />
                  <Sparkles className="w-6 h-6 text-accent absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                It&apos;s a Match!
              </h2>
              <p className="text-muted-foreground font-mono mt-2">
                You and {matchedUser.name.split(' ')[0]} liked each other
              </p>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-primary/50 animate-pulse-glow">
                  <AvatarImage src={matchedUser.avatar} alt={matchedUser.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-mono text-3xl">
                    {matchedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold font-mono">{matchedUser.name}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {matchedUser.bio}
              </p>
            </div>

            {/* Skills preview */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {matchedUser.skills.slice(0, 4).map(skill => (
                <span 
                  key={skill}
                  className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 font-mono"
                onClick={onClose}
              >
                Keep Swiping
              </Button>
              <Button
                className="flex-1 font-mono bg-primary hover:bg-primary/90"
                onClick={onClose}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Say Hello
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
