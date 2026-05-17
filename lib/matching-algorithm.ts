// Matching Algorithm for HackMatch

import { UserProfile } from './mock-data';

export interface MatchResult {
  user: UserProfile;
  compatibilityScore: number;
  breakdown: {
    skillsScore: number;
    interestsScore: number;
    workStyleScore: number;
  };
  matchReasons: string[];
}

// Skills that complement each other
const complementarySkills: Record<string, string[]> = {
  'Frontend': ['Backend', 'UI/UX Design', 'Database Design'],
  'Backend': ['Frontend', 'DevOps', 'Database Design'],
  'UI/UX Design': ['Frontend', 'Product Design', 'React'],
  'Full Stack': ['UI/UX Design', 'DevOps', 'Product Design'],
  'Machine Learning': ['Backend', 'Data Science', 'Python'],
  'Data Science': ['Machine Learning', 'Backend', 'API Design'],
  'DevOps': ['Backend', 'System Architecture', 'Full Stack'],
  'Mobile (React Native)': ['Backend', 'UI/UX Design', 'API Design'],
  'Mobile (Flutter)': ['Backend', 'UI/UX Design', 'API Design'],
  'Blockchain': ['Backend', 'Smart Contracts', 'Web3'],
  'Smart Contracts': ['Blockchain', 'Backend', 'Cybersecurity'],
  'Web3': ['Blockchain', 'Smart Contracts', 'Frontend'],
  'System Architecture': ['Backend', 'DevOps', 'Database Design'],
  'API Design': ['Backend', 'Frontend', 'Database Design'],
  'Product Design': ['UI/UX Design', 'Frontend', 'Full Stack'],
};

// Work style compatibility matrix
const workStyleCompatibility = {
  role: {
    'leader': { 'executor': 1.0, 'flexible': 0.8, 'leader': 0.4 },
    'executor': { 'leader': 1.0, 'flexible': 0.8, 'executor': 0.6 },
    'flexible': { 'leader': 0.8, 'executor': 0.8, 'flexible': 0.9 },
  },
  schedule: {
    'night-owl': { 'night-owl': 1.0, 'flexible': 0.8, 'early-bird': 0.4 },
    'early-bird': { 'early-bird': 1.0, 'flexible': 0.8, 'night-owl': 0.4 },
    'flexible': { 'night-owl': 0.8, 'early-bird': 0.8, 'flexible': 1.0 },
  },
  stressHandling: {
    'calm': { 'calm': 1.0, 'energized': 0.7, 'needs-support': 0.8 },
    'energized': { 'energized': 0.8, 'calm': 0.7, 'needs-support': 0.5 },
    'needs-support': { 'calm': 0.9, 'energized': 0.5, 'needs-support': 0.6 },
  },
};

function calculateSkillsScore(currentUser: UserProfile, otherUser: UserProfile): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  let maxScore = 0;

  // Check for complementary skills
  currentUser.skills.forEach(skill => {
    const complements = complementarySkills[skill] || [];
    complements.forEach(complement => {
      maxScore += 1;
      if (otherUser.skills.includes(complement)) {
        score += 1;
        reasons.push(`Your ${skill} pairs well with their ${complement}`);
      }
    });
  });

  // Check for shared skills (also valuable but weighted less)
  const sharedSkills = currentUser.skills.filter(skill => otherUser.skills.includes(skill));
  if (sharedSkills.length > 0) {
    score += sharedSkills.length * 0.3;
    maxScore += currentUser.skills.length * 0.3;
    if (sharedSkills.length >= 2) {
      reasons.push(`You both know ${sharedSkills.slice(0, 2).join(' and ')}`);
    }
  }

  // Check for skill diversity (covering different areas)
  const uniqueSkills = otherUser.skills.filter(skill => !currentUser.skills.includes(skill));
  if (uniqueSkills.length > 0) {
    score += uniqueSkills.length * 0.2;
    maxScore += 5 * 0.2;
    reasons.push(`They bring ${uniqueSkills.slice(0, 2).join(', ')} expertise`);
  }

  return {
    score: maxScore > 0 ? (score / maxScore) * 100 : 0,
    reasons: reasons.slice(0, 3)
  };
}

function calculateInterestsScore(currentUser: UserProfile, otherUser: UserProfile): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  const sharedInterests = currentUser.interests.filter(interest => 
    otherUser.interests.includes(interest)
  );

  if (sharedInterests.length > 0) {
    reasons.push(`Shared passion for ${sharedInterests.slice(0, 2).join(' and ')}`);
  }

  const score = (sharedInterests.length / Math.max(currentUser.interests.length, 1)) * 100;
  
  return { score, reasons };
}

function calculateWorkStyleScore(currentUser: UserProfile, otherUser: UserProfile): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  
  const roleScore = workStyleCompatibility.role[currentUser.workStyle.role][otherUser.workStyle.role];
  const scheduleScore = workStyleCompatibility.schedule[currentUser.workStyle.schedule][otherUser.workStyle.schedule];
  const stressScore = workStyleCompatibility.stressHandling[currentUser.workStyle.stressHandling][otherUser.workStyle.stressHandling];

  if (roleScore >= 0.8) {
    if (currentUser.workStyle.role === 'leader' && otherUser.workStyle.role === 'executor') {
      reasons.push('Great leader-executor dynamic');
    } else if (currentUser.workStyle.role === 'executor' && otherUser.workStyle.role === 'leader') {
      reasons.push('You\'ll have clear direction');
    } else if (currentUser.workStyle.role === 'flexible') {
      reasons.push('Flexible collaboration style');
    }
  }

  if (scheduleScore >= 0.8) {
    if (currentUser.workStyle.schedule === otherUser.workStyle.schedule) {
      const scheduleText = currentUser.workStyle.schedule === 'night-owl' ? 'night owls' : 
                          currentUser.workStyle.schedule === 'early-bird' ? 'early birds' : 'flexible schedules';
      reasons.push(`Both ${scheduleText} - easy to sync up!`);
    }
  }

  const avgScore = ((roleScore + scheduleScore + stressScore) / 3) * 100;
  
  return { score: avgScore, reasons };
}

export function calculateCompatibility(currentUser: UserProfile, otherUser: UserProfile): MatchResult {
  const skillsResult = calculateSkillsScore(currentUser, otherUser);
  const interestsResult = calculateInterestsScore(currentUser, otherUser);
  const workStyleResult = calculateWorkStyleScore(currentUser, otherUser);

  // Weighted average: Skills 40%, Interests 30%, Work Style 30%
  const totalScore = (
    skillsResult.score * 0.4 +
    interestsResult.score * 0.3 +
    workStyleResult.score * 0.3
  );

  const allReasons = [
    ...skillsResult.reasons,
    ...interestsResult.reasons,
    ...workStyleResult.reasons
  ].slice(0, 4);

  return {
    user: otherUser,
    compatibilityScore: Math.round(totalScore),
    breakdown: {
      skillsScore: Math.round(skillsResult.score),
      interestsScore: Math.round(interestsResult.score),
      workStyleScore: Math.round(workStyleResult.score)
    },
    matchReasons: allReasons
  };
}

export function findMatches(
  currentUser: UserProfile, 
  allUsers: UserProfile[],
  options?: {
    maxDistance?: number;
    sortByProximity?: boolean;
    minCompatibility?: number;
  }
): MatchResult[] {
  const { maxDistance, sortByProximity, minCompatibility = 0 } = options || {};
  
  let results = allUsers
    .filter(user => user.id !== currentUser.id)
    .filter(user => !currentUser.connections.includes(user.id))
    .filter(user => !currentUser.matches.includes(user.id))
    .map(user => calculateCompatibility(currentUser, user))
    .filter(result => result.compatibilityScore >= minCompatibility);

  // Apply distance filter
  if (maxDistance && currentUser.location?.enabled) {
    results = results.filter(result => 
      (result.user.distance || 0) <= maxDistance
    );
  }

  // Sort by compatibility score first
  results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // If proximity sorting is enabled, re-sort with proximity factored in
  if (sortByProximity && currentUser.location?.enabled) {
    results.sort((a, b) => {
      // Create a combined score: 70% compatibility, 30% proximity
      const aDistance = a.user.distance || 999;
      const bDistance = b.user.distance || 999;
      const maxDist = Math.max(aDistance, bDistance, 1);
      
      const aProximityScore = (1 - aDistance / maxDist) * 100;
      const bProximityScore = (1 - bDistance / maxDist) * 100;
      
      const aCombined = a.compatibilityScore * 0.7 + aProximityScore * 0.3;
      const bCombined = b.compatibilityScore * 0.7 + bProximityScore * 0.3;
      
      return bCombined - aCombined;
    });
  }

  return results;
}
