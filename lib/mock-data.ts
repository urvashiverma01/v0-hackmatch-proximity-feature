// Mock Database for HackMatch

export interface UserProfile {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  bio: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  skills: string[];
  interests: string[];
  workStyle: {
    role: 'leader' | 'executor' | 'flexible';
    schedule: 'night-owl' | 'early-bird' | 'flexible';
    stressHandling: 'calm' | 'energized' | 'needs-support';
  };
  location?: {
    lat: number;
    lng: number;
    enabled: boolean;
  };
  distance?: number;
  onboardingComplete: boolean;
  connections: string[];
  pendingConnections: string[];
  matches: string[];
  createdAt: string;
}

export const skillOptions = [
  'React', 'Vue', 'Angular', 'Next.js', 'TypeScript',
  'Python', 'Node.js', 'Go', 'Rust', 'Java',
  'UI/UX Design', 'Figma', 'Product Design',
  'Backend', 'Frontend', 'Full Stack',
  'Machine Learning', 'Data Science', 'DevOps',
  'Mobile (React Native)', 'Mobile (Flutter)',
  'Blockchain', 'Smart Contracts', 'Web3',
  'Database Design', 'API Design', 'System Architecture'
];

export const interestOptions = [
  'Web3 / Blockchain', 'Artificial Intelligence', 'FinTech',
  'EdTech', 'HealthTech', 'Climate Tech', 'Social Impact',
  'Gaming', 'AR/VR', 'IoT', 'Cybersecurity',
  'Developer Tools', 'Productivity', 'E-commerce'
];

// Pre-populated mock profiles
export const mockProfiles: UserProfile[] = [
  {
    id: '1',
    email: 'alex.chen@email.com',
    password: 'password123',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Full-stack developer passionate about building scalable web applications. Love hackathons and coffee! ☕',
    github: 'alexchen',
    skills: ['React', 'Node.js', 'TypeScript', 'Full Stack', 'Database Design'],
    interests: ['FinTech', 'Developer Tools', 'Artificial Intelligence'],
    workStyle: { role: 'flexible', schedule: 'night-owl', stressHandling: 'calm' },
    location: { lat: 37.7749, lng: -122.4194, enabled: true },
    distance: 0.5,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    email: 'sarah.kim@email.com',
    password: 'password123',
    name: 'Sarah Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'UI/UX designer who codes. I turn complex problems into beautiful, intuitive interfaces.',
    portfolio: 'sarahkim.design',
    skills: ['UI/UX Design', 'Figma', 'React', 'Frontend', 'Product Design'],
    interests: ['EdTech', 'Social Impact', 'Productivity'],
    workStyle: { role: 'executor', schedule: 'early-bird', stressHandling: 'calm' },
    location: { lat: 37.7849, lng: -122.4094, enabled: true },
    distance: 1.2,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    email: 'marcus.johnson@email.com',
    password: 'password123',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    bio: 'Backend wizard specializing in distributed systems. Former startup founder. Let\'s build something amazing!',
    github: 'mjohnson',
    linkedin: 'marcusjohnson',
    skills: ['Python', 'Go', 'Backend', 'System Architecture', 'DevOps'],
    interests: ['Web3 / Blockchain', 'FinTech', 'Developer Tools'],
    workStyle: { role: 'leader', schedule: 'flexible', stressHandling: 'energized' },
    location: { lat: 37.7649, lng: -122.4294, enabled: true },
    distance: 2.1,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    email: 'emma.watson@email.com',
    password: 'password123',
    name: 'Emma Watson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    bio: 'ML engineer with a passion for NLP. Building AI that understands humans better.',
    github: 'emmawatson-ml',
    skills: ['Python', 'Machine Learning', 'Data Science', 'Backend', 'API Design'],
    interests: ['Artificial Intelligence', 'HealthTech', 'Social Impact'],
    workStyle: { role: 'executor', schedule: 'night-owl', stressHandling: 'calm' },
    location: { lat: 37.7549, lng: -122.4394, enabled: true },
    distance: 3.5,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    email: 'david.park@email.com',
    password: 'password123',
    name: 'David Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    bio: 'Mobile dev who ships fast. React Native enthusiast. Always looking for the next big idea.',
    github: 'davidpark',
    skills: ['Mobile (React Native)', 'TypeScript', 'React', 'Frontend', 'UI/UX Design'],
    interests: ['Gaming', 'Social Impact', 'Productivity'],
    workStyle: { role: 'flexible', schedule: 'night-owl', stressHandling: 'energized' },
    location: { lat: 37.7949, lng: -122.3994, enabled: true },
    distance: 4.2,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-18'
  },
  {
    id: '6',
    email: 'lisa.nguyen@email.com',
    password: 'password123',
    name: 'Lisa Nguyen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    bio: 'Blockchain developer building the decentralized future. Smart contract security specialist.',
    github: 'lisanguyen',
    skills: ['Blockchain', 'Smart Contracts', 'Web3', 'Rust', 'Backend'],
    interests: ['Web3 / Blockchain', 'FinTech', 'Cybersecurity'],
    workStyle: { role: 'leader', schedule: 'flexible', stressHandling: 'calm' },
    location: { lat: 37.7449, lng: -122.4494, enabled: true },
    distance: 5.8,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-08'
  },
  {
    id: '7',
    email: 'james.williams@email.com',
    password: 'password123',
    name: 'James Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    bio: 'DevOps engineer who loves automation. CI/CD pipelines are my art form.',
    github: 'jameswilliams',
    skills: ['DevOps', 'Python', 'Go', 'System Architecture', 'Backend'],
    interests: ['Developer Tools', 'Cybersecurity', 'Climate Tech'],
    workStyle: { role: 'executor', schedule: 'early-bird', stressHandling: 'calm' },
    location: { lat: 37.7349, lng: -122.4594, enabled: true },
    distance: 7.3,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-05'
  },
  {
    id: '8',
    email: 'olivia.martinez@email.com',
    password: 'password123',
    name: 'Olivia Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
    bio: 'Product designer turned developer. I bridge the gap between design and code.',
    portfolio: 'oliviamart.design',
    skills: ['UI/UX Design', 'Figma', 'React', 'Next.js', 'Product Design'],
    interests: ['EdTech', 'HealthTech', 'Productivity'],
    workStyle: { role: 'flexible', schedule: 'early-bird', stressHandling: 'needs-support' },
    location: { lat: 37.7249, lng: -122.4694, enabled: true },
    distance: 8.9,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-22'
  },
  {
    id: '9',
    email: 'ryan.thompson@email.com',
    password: 'password123',
    name: 'Ryan Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan',
    bio: 'AR/VR developer exploring the metaverse. Unity & Unreal Engine expert.',
    github: 'ryanthompson',
    skills: ['Mobile (Flutter)', 'Backend', 'Java', 'System Architecture', 'DevOps'],
    interests: ['AR/VR', 'Gaming', 'IoT'],
    workStyle: { role: 'leader', schedule: 'night-owl', stressHandling: 'energized' },
    location: { lat: 37.7149, lng: -122.4794, enabled: true },
    distance: 10.5,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-14'
  },
  {
    id: '10',
    email: 'sophia.lee@email.com',
    password: 'password123',
    name: 'Sophia Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia',
    bio: 'Data scientist passionate about using ML for social good. Let\'s make an impact together!',
    linkedin: 'sophialee',
    skills: ['Python', 'Data Science', 'Machine Learning', 'API Design', 'Backend'],
    interests: ['Artificial Intelligence', 'Climate Tech', 'Social Impact'],
    workStyle: { role: 'executor', schedule: 'flexible', stressHandling: 'calm' },
    location: { lat: 37.7049, lng: -122.4894, enabled: true },
    distance: 12.1,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-16'
  },
  {
    id: '11',
    email: 'mike.brown@email.com',
    password: 'password123',
    name: 'Mike Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    bio: 'Frontend architect with an eye for performance. React & Vue specialist.',
    github: 'mikebrown',
    skills: ['React', 'Vue', 'TypeScript', 'Frontend', 'Next.js'],
    interests: ['Developer Tools', 'E-commerce', 'Productivity'],
    workStyle: { role: 'flexible', schedule: 'early-bird', stressHandling: 'calm' },
    location: { lat: 37.6949, lng: -122.4994, enabled: true },
    distance: 15.3,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-11'
  },
  {
    id: '12',
    email: 'nina.patel@email.com',
    password: 'password123',
    name: 'Nina Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina',
    bio: 'Full-stack fintech enthusiast. Building the future of finance, one API at a time.',
    github: 'ninapatel',
    linkedin: 'ninapatel',
    skills: ['Node.js', 'TypeScript', 'Full Stack', 'Database Design', 'API Design'],
    interests: ['FinTech', 'Web3 / Blockchain', 'Cybersecurity'],
    workStyle: { role: 'leader', schedule: 'night-owl', stressHandling: 'energized' },
    location: { lat: 37.6849, lng: -122.5094, enabled: true },
    distance: 18.7,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-09'
  },
  {
    id: '13',
    email: 'chris.davis@email.com',
    password: 'password123',
    name: 'Chris Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris',
    bio: 'Security-first developer. Ethical hacker by night, backend dev by day.',
    github: 'chrisdavis',
    skills: ['Backend', 'Python', 'Go', 'DevOps', 'System Architecture'],
    interests: ['Cybersecurity', 'Developer Tools', 'FinTech'],
    workStyle: { role: 'executor', schedule: 'night-owl', stressHandling: 'calm' },
    location: { lat: 37.6749, lng: -122.5194, enabled: true },
    distance: 22.4,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-07'
  },
  {
    id: '14',
    email: 'amy.zhang@email.com',
    password: 'password123',
    name: 'Amy Zhang',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amy',
    bio: 'Creative technologist blending art and code. Making tech more human.',
    portfolio: 'amyzhang.art',
    skills: ['UI/UX Design', 'Frontend', 'React', 'Figma', 'Product Design'],
    interests: ['AR/VR', 'Social Impact', 'EdTech'],
    workStyle: { role: 'flexible', schedule: 'flexible', stressHandling: 'needs-support' },
    location: { lat: 37.6649, lng: -122.5294, enabled: true },
    distance: 28.6,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-19'
  },
  {
    id: '15',
    email: 'tom.anderson@email.com',
    password: 'password123',
    name: 'Tom Anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
    bio: 'IoT hacker and embedded systems enthusiast. Hardware meets software.',
    github: 'tomanderson',
    skills: ['Python', 'Rust', 'Backend', 'System Architecture', 'DevOps'],
    interests: ['IoT', 'Climate Tech', 'HealthTech'],
    workStyle: { role: 'leader', schedule: 'early-bird', stressHandling: 'energized' },
    location: { lat: 37.6549, lng: -122.5394, enabled: true },
    distance: 35.2,
    onboardingComplete: true,
    connections: [],
    pendingConnections: [],
    matches: [],
    createdAt: '2024-01-06'
  }
];

// Mock database operations
class MockDatabase {
  private users: UserProfile[] = [...mockProfiles];

  getAllUsers(): UserProfile[] {
    return this.users;
  }

  getUserById(id: string): UserProfile | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.users.find(user => user.email === email);
  }

  createUser(user: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile {
    const newUser: UserProfile = {
      ...user,
      id: (this.users.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return undefined;
  }

  addConnection(userId: string, targetId: string): boolean {
    const user = this.getUserById(userId);
    const target = this.getUserById(targetId);
    
    if (user && target) {
      // Check if target has pending connection from user
      if (target.pendingConnections.includes(userId)) {
        // It's a match!
        target.pendingConnections = target.pendingConnections.filter(id => id !== userId);
        user.matches.push(targetId);
        target.matches.push(userId);
        user.connections.push(targetId);
        target.connections.push(userId);
        return true; // Return true to indicate a match
      } else {
        // Add to pending
        if (!target.pendingConnections.includes(userId)) {
          target.pendingConnections.push(userId);
        }
        return false;
      }
    }
    return false;
  }
}

export const mockDb = new MockDatabase();
