'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { skillOptions, interestOptions } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Save, 
  MapPin, 
  Check,
  Loader2,
  Code2,
  Lightbulb,
  Brain,
  Github,
  Linkedin,
  Globe,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    workStyle: user?.workStyle || {
      role: 'flexible' as const,
      schedule: 'flexible' as const,
      stressHandling: 'calm' as const
    },
    location: user?.location || {
      lat: 0,
      lng: 0,
      enabled: false
    }
  });

  if (!user) return null;

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

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateProfile(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      bio: user.bio,
      github: user.github || '',
      linkedin: user.linkedin || '',
      portfolio: user.portfolio || '',
      skills: user.skills,
      interests: user.interests,
      workStyle: user.workStyle,
      location: user.location || { lat: 0, lng: 0, enabled: false }
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-mono flex items-center gap-2">
            <span className="text-terminal">&gt;</span> Profile
          </h1>
          <p className="text-muted-foreground font-mono mt-1">
            Manage your profile and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="font-mono">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="font-mono">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="font-mono bg-primary hover:bg-primary/90">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/30 to-accent/30" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <Avatar className="w-24 h-24 border-4 border-card">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-primary font-mono text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold font-mono">{user.name}</h2>
              <p className="text-muted-foreground font-mono">{user.email}</p>
              {user.location?.enabled && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  Location enabled
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {user.github && (
                <a
                  href={`https://github.com/${user.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {user.linkedin && (
                <a
                  href={`https://linkedin.com/in/${user.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {user.portfolio && (
                <a
                  href={`https://${user.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio & Links */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label className="font-mono text-sm">Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell potential teammates about yourself..."
                  className="font-mono bg-input border-border min-h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-sm">GitHub Username</Label>
                  <Input
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="username"
                    className="font-mono bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">LinkedIn Username</Label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="username"
                    className="font-mono bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Portfolio URL</Label>
                  <Input
                    value={formData.portfolio}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                    placeholder="yoursite.com"
                    className="font-mono bg-input border-border"
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              {user.bio || 'No bio added yet. Edit your profile to add one!'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            Technical Skills
          </CardTitle>
          <CardDescription className="font-mono">
            {isEditing ? 'Select skills that describe your expertise' : `${user.skills.length} skills selected`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <Button
                  key={skill}
                  type="button"
                  variant={formData.skills.includes(skill) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "font-mono text-xs",
                    formData.skills.includes(skill) ? "bg-primary text-primary-foreground" : "border-border"
                  )}
                >
                  {formData.skills.includes(skill) && <Check className="w-3 h-3 mr-1" />}
                  {skill}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="font-mono">
                  {skill}
                </Badge>
              ))}
              {user.skills.length === 0 && (
                <p className="text-muted-foreground text-sm">No skills added yet</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Project Interests
          </CardTitle>
          <CardDescription className="font-mono">
            {isEditing ? 'What types of projects excite you?' : `${user.interests.length} interests selected`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <Button
                  key={interest}
                  type="button"
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "font-mono text-xs",
                    formData.interests.includes(interest) ? "bg-accent text-accent-foreground" : "border-border"
                  )}
                >
                  {formData.interests.includes(interest) && <Check className="w-3 h-3 mr-1" />}
                  {interest}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.interests.map(interest => (
                <Badge key={interest} className="font-mono bg-accent/20 text-accent-foreground border-accent/30">
                  {interest}
                </Badge>
              ))}
              {user.interests.length === 0 && (
                <p className="text-muted-foreground text-sm">No interests added yet</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Style */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <Brain className="w-5 h-5 text-terminal" />
            Work Style
          </CardTitle>
          <CardDescription className="font-mono">
            How you prefer to work with a team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role preference */}
          <div className="space-y-2">
            <Label className="font-mono text-sm text-muted-foreground">Role Preference</Label>
            {isEditing ? (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'leader', label: 'Leader' },
                  { value: 'executor', label: 'Executor' },
                  { value: 'flexible', label: 'Flexible' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={formData.workStyle.role === option.value ? "default" : "outline"}
                    onClick={() => updateWorkStyle('role', option.value)}
                    className="font-mono"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            ) : (
              <Badge variant="secondary" className="font-mono capitalize">
                {user.workStyle.role}
              </Badge>
            )}
          </div>

          {/* Schedule preference */}
          <div className="space-y-2">
            <Label className="font-mono text-sm text-muted-foreground">Schedule Preference</Label>
            {isEditing ? (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'night-owl', label: 'Night Owl 🦉' },
                  { value: 'early-bird', label: 'Early Bird 🐦' },
                  { value: 'flexible', label: 'Flexible ⚡' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={formData.workStyle.schedule === option.value ? "default" : "outline"}
                    onClick={() => updateWorkStyle('schedule', option.value)}
                    className="font-mono"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            ) : (
              <Badge variant="secondary" className="font-mono capitalize">
                {user.workStyle.schedule.replace('-', ' ')}
              </Badge>
            )}
          </div>

          {/* Stress handling */}
          <div className="space-y-2">
            <Label className="font-mono text-sm text-muted-foreground">Stress Handling</Label>
            {isEditing ? (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'calm', label: 'Stay Calm 😌' },
                  { value: 'energized', label: 'Get Energized 🔥' },
                  { value: 'needs-support', label: 'Need Support 🤝' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={formData.workStyle.stressHandling === option.value ? "default" : "outline"}
                    onClick={() => updateWorkStyle('stressHandling', option.value)}
                    className="font-mono"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            ) : (
              <Badge variant="secondary" className="font-mono capitalize">
                {user.workStyle.stressHandling.replace('-', ' ')}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Location
          </CardTitle>
          <CardDescription className="font-mono">
            Enable location to find nearby teammates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formData.location.enabled || user.location?.enabled ? (
            <div className="flex items-center gap-2 text-terminal font-mono">
              <Check className="w-5 h-5" />
              Location enabled - teammates can find you nearby
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={enableLocation}
              disabled={locationLoading}
              className="font-mono"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
