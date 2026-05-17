'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, mockDb } from '@/lib/mock-data';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('hackmatch_token');
    const userId = localStorage.getItem('hackmatch_user_id');
    
    if (token && userId) {
      const foundUser = mockDb.getUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const foundUser = mockDb.getUserByEmail(email);
    
    if (!foundUser) {
      return { success: false, error: 'User not found' };
    }
    
    if (foundUser.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    // Generate mock JWT token
    const token = btoa(JSON.stringify({ userId: foundUser.id, exp: Date.now() + 86400000 }));
    localStorage.setItem('hackmatch_token', token);
    localStorage.setItem('hackmatch_user_id', foundUser.id);
    
    setUser(foundUser);
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    const existingUser = mockDb.getUserByEmail(email);
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = mockDb.createUser({
      email,
      password,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
      bio: '',
      skills: [],
      interests: [],
      workStyle: {
        role: 'flexible',
        schedule: 'flexible',
        stressHandling: 'calm'
      },
      onboardingComplete: false,
      connections: [],
      pendingConnections: [],
      matches: []
    });

    // Generate mock JWT token
    const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + 86400000 }));
    localStorage.setItem('hackmatch_token', token);
    localStorage.setItem('hackmatch_user_id', newUser.id);
    
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('hackmatch_token');
    localStorage.removeItem('hackmatch_user_id');
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = mockDb.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
