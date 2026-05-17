'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { skillOptions, interestOptions, UserProfile } from '@/lib/mock-data';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Code2, 
  Lightbulb, 
  Brain,
  MapPin,
  Loader2,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Technical Skills', icon: <Code2 className="w-5 h-5" /> },
  { id: 2, title: 'Project Interests', icon: <Lightbulb className="w-5 h-5" /> },
  { id: 3, title: 'Work Style', icon: <Brain className="w-5 h-5" /> },
  { id: 4, title: 'Location & Bio', icon: <MapPin className="w-5 h-5" /> },
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    skills: user?.skills || [],
    interests: user?.interests || [],
    workStyle: user?.workStyle || {
      role: 'flexible' as const,
      schedule: 'flexible' as const,
      stressHandling: 'calm' as const
    },
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    location: user?.location || {
      lat: 0,
      lng: 0,
      enabled: false
    }
  });

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const updateWorkStyle = (key: keyof typeof formData.workStyle, value: string) => {
    setFormData(prev => ({
      ...prev,
      workStyle: {
        ...prev.workStyle,
        [key]: value
      }
    }));
  };

  const enableLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              enabled: true
            }
          }));
          setLocationLoading(false);
        },
        () => {
          // On error, use mock location
          setFormData(prev => ({
            ...prev,
            location: {
              lat: 37.7749 + (Math.random() - 0.5) * 0.1,
              lng: -122.4194 + (Math.random() - 0.5) * 0.1,
              enabled: true
            }
          }));
          setLocationLoading(false);
        }
      );
    } else {
      // Fallback mock location
      setFormData(prev => ({
        ...prev,
        location: {
          lat: 37.7749,
          lng: -122.4194,
          enabled: true
        }
      }));
      setLocationLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateProfile({
      ...formData,
      onboardingComplete: true
    } as Partial<UserProfile>);
    
    setIsLoading(false);
    onComplete();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.skills.length >= 2;
      case 2:
        return formData.interests.length >= 1;
      case 3:
        return true;
      case 4:
        return formData.bio.length >= 10;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen grid-background flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-border/50 card-glow relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-sm">onboarding_wizard.sh</span>
          </div>
          <CardTitle className="text-2xl font-mono">
            <span className="text-terminal">&gt;</span> {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription className="font-mono">
            Step {currentStep} of {steps.length}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="flex gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex-1 h-2 rounded-full transition-all duration-300",
                  currentStep >= step.id ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Technical Skills */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <p className="text-sm text-muted-foreground font-mono">
                Select at least 2 skills that describe your expertise:
              </p>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      "font-mono text-xs transition-all duration-200",
                      formData.skills.includes(skill) 
                        ? "bg-primary text-primary-foreground" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {formData.skills.includes(skill) && <Check className="w-3 h-3 mr-1" />}
                    {skill}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Selected: {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Step 2: Project Interests */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in-up">
              <p className="text-sm text-muted-foreground font-mono">
                What types of projects excite you? Select at least 1:
              </p>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Button
                    key={interest}
                    type="button"
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "font-mono text-xs transition-all duration-200",
                      formData.interests.includes(interest) 
                        ? "bg-accent text-accent-foreground" 
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    {formData.interests.includes(interest) && <Check className="w-3 h-3 mr-1" />}
                    {interest}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Selected: {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Step 3: Work Style */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="space-y-3">
                <Label className="font-mono text-sm">
                  <span className="text-terminal">$</span> Do you prefer leading or executing?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'leader', label: 'Leader', desc: 'I like to guide the team' },
                    { value: 'executor', label: 'Executor', desc: 'I prefer clear direction' },
                    { value: 'flexible', label: 'Flexible', desc: 'Either works for me' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.workStyle.role === option.value ? "default" : "outline"}
                      className={cn(
                        "h-auto flex-col py-4 font-mono",
                        formData.workStyle.role === option.value 
                          ? "bg-primary text-primary-foreground" 
                          : "border-border"
                      )}
                      onClick={() => updateWorkStyle('role', option.value)}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                      <span className="text-xs opacity-70 mt-1">{option.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-mono text-sm">
                  <span className="text-terminal">$</span> Are you a night owl or early bird?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'night-owl', label: 'Night Owl 🦉', desc: 'Peak at night' },
                    { value: 'early-bird', label: 'Early Bird 🐦', desc: 'Peak in morning' },
                    { value: 'flexible', label: 'Flexible ⚡', desc: 'Anytime works' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.workStyle.schedule === option.value ? "default" : "outline"}
                      className={cn(
                        "h-auto flex-col py-4 font-mono",
                        formData.workStyle.schedule === option.value 
                          ? "bg-primary text-primary-foreground" 
                          : "border-border"
                      )}
                      onClick={() => updateWorkStyle('schedule', option.value)}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                      <span className="text-xs opacity-70 mt-1">{option.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-mono text-sm">
                  <span className="text-terminal">$</span> How do you handle stress?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'calm', label: 'Stay Calm 😌', desc: 'I keep cool' },
                    { value: 'energized', label: 'Get Energized 🔥', desc: 'Stress fuels me' },
                    { value: 'needs-support', label: 'Need Support 🤝', desc: 'Team helps me' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.workStyle.stressHandling === option.value ? "default" : "outline"}
                      className={cn(
                        "h-auto flex-col py-4 font-mono",
                        formData.workStyle.stressHandling === option.value 
                          ? "bg-primary text-primary-foreground" 
                          : "border-border"
                      )}
                      onClick={() => updateWorkStyle('stressHandling', option.value)}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                      <span className="text-xs opacity-70 mt-1">{option.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Location & Bio */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="space-y-3">
                <Label htmlFor="bio" className="font-mono text-sm">
                  <span className="text-terminal">$</span> Bio (tell teammates about yourself)
                </Label>
                <Textarea
                  id="bio"
                  placeholder="I'm a passionate developer who loves building products that make a difference..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="font-mono bg-input border-border min-h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github" className="font-mono text-sm">GitHub</Label>
                  <Input
                    id="github"
                    placeholder="username"
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    className="font-mono bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="font-mono text-sm">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="font-mono bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="font-mono text-sm">Portfolio</Label>
                  <Input
                    id="portfolio"
                    placeholder="yoursite.com"
                    value={formData.portfolio}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                    className="font-mono bg-input border-border"
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-medium">Enable Location</p>
                    <p className="text-xs text-muted-foreground">Find teammates near you</p>
                  </div>
                  {formData.location.enabled ? (
                    <div className="flex items-center gap-2 text-terminal font-mono text-sm">
                      <Check className="w-4 h-4" />
                      Location enabled
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={enableLocation}
                      disabled={locationLoading}
                      className="font-mono"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              className="font-mono"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="font-mono bg-primary hover:bg-primary/90"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
                className="font-mono bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
