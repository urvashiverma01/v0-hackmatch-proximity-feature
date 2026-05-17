'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Eye, EyeOff, Loader2, Zap, Users, Target } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    const result = await login('alex.chen@email.com', 'password123');
    if (result.success) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid-background flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-lg border border-primary/30">
                <Terminal className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold font-mono tracking-tight">
                <span className="text-primary">Hack</span>
                <span className="text-foreground">Match</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground font-mono">
              <span className="text-terminal">&gt;</span> Find your perfect hackathon team
              <span className="animate-blink">_</span>
            </p>
          </div>

          <div className="space-y-6">
            <FeatureItem 
              icon={<Users className="w-5 h-5" />}
              title="Smart Matching"
              description="AI-powered compatibility scoring based on skills, interests, and work style"
            />
            <FeatureItem 
              icon={<Target className="w-5 h-5" />}
              title="Proximity Search"
              description="Find teammates near you for seamless in-person collaboration"
            />
            <FeatureItem 
              icon={<Zap className="w-5 h-5" />}
              title="Instant Connect"
              description="Swipe, match, and start building together in seconds"
            />
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground font-mono">
              <span className="text-terminal">$</span> Join <span className="text-primary">500+</span> developers already matching
            </p>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 card-glow">
            <CardHeader className="space-y-1 text-center">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <Terminal className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold font-mono">
                  <span className="text-primary">Hack</span>Match
                </span>
              </div>
              <CardTitle className="text-2xl font-mono">
                {isLogin ? '> login' : '> register'}
              </CardTitle>
              <CardDescription className="font-mono text-muted-foreground">
                {isLogin ? 'Welcome back, hacker' : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in-up">
                    <Label htmlFor="name" className="font-mono text-sm">
                      <span className="text-terminal">$</span> name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="font-mono bg-input border-border focus:border-primary transition-colors"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-sm">
                    <span className="text-terminal">$</span> email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="font-mono bg-input border-border focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-mono text-sm">
                    <span className="text-terminal">$</span> password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="font-mono bg-input border-border focus:border-primary transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive font-mono">{`> Error: ${error}`}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full font-mono bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>{isLogin ? '> ssh login' : '> initialize user'}</>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground font-mono">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full font-mono border-border hover:bg-secondary hover:border-primary/50"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Zap className="w-4 h-4 mr-2" />
                {`> quick_demo --user=alex`}
              </Button>

              <p className="text-center text-sm text-muted-foreground font-mono">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-primary hover:underline"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold font-mono text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
