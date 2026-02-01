// Simulated users for the leaderboard
// In a real app, this would come from a backend API

export interface LeaderboardEntry {
  id: string;
  username: string;
  averageScore: number;
  quizzesMastered: number;
  totalAttempts: number;
  isCurrentUser?: boolean;
}

// Base mock users - these simulate other players
const mockUsers: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  { id: 'user-1', username: 'AIExpert42', averageScore: 94, quizzesMastered: 3, totalAttempts: 12 },
  { id: 'user-2', username: 'PromptMaster', averageScore: 91, quizzesMastered: 3, totalAttempts: 8 },
  { id: 'user-3', username: 'AgentDev', averageScore: 87, quizzesMastered: 2, totalAttempts: 15 },
  { id: 'user-4', username: 'NeuralNinja', averageScore: 84, quizzesMastered: 2, totalAttempts: 9 },
  { id: 'user-5', username: 'MLEnthusiast', averageScore: 82, quizzesMastered: 2, totalAttempts: 6 },
  { id: 'user-6', username: 'DeepLearner', averageScore: 79, quizzesMastered: 2, totalAttempts: 11 },
  { id: 'user-7', username: 'TechLearner', averageScore: 76, quizzesMastered: 1, totalAttempts: 10 },
  { id: 'user-8', username: 'CodeCrafter', averageScore: 72, quizzesMastered: 1, totalAttempts: 7 },
  { id: 'user-9', username: 'DataDriven', averageScore: 68, quizzesMastered: 1, totalAttempts: 5 },
  { id: 'user-10', username: 'AINewbie', averageScore: 64, quizzesMastered: 0, totalAttempts: 4 },
];

export function getLeaderboard(currentUser: {
  username: string;
  averageScore: number;
  quizzesMastered: number;
  totalAttempts: number;
} | null): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = mockUsers.map((user) => ({
    ...user,
    isCurrentUser: false,
  }));

  // Add current user if they have attempts
  if (currentUser && currentUser.totalAttempts > 0) {
    entries.push({
      id: 'current-user',
      username: currentUser.username,
      averageScore: currentUser.averageScore,
      quizzesMastered: currentUser.quizzesMastered,
      totalAttempts: currentUser.totalAttempts,
      isCurrentUser: true,
    });
  }

  // Sort by average score descending
  return entries.sort((a, b) => b.averageScore - a.averageScore);
}
