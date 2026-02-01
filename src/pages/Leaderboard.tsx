import { Trophy, Medal } from 'lucide-react';
import { Card } from '../components/ui/card';
import { storage } from '../services/storage';
import { quizzes } from '../data/quizzes';
import { getLeaderboard } from '../data/mockLeaderboard';

export function Leaderboard() {
  const profile = storage.getProfile();
  const attempts = storage.getAttempts();

  // Calculate current user stats
  const currentUserStats = profile && attempts.length > 0
    ? {
        username: profile.username,
        averageScore: Math.round(
          attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length
        ),
        quizzesMastered: quizzes.filter((quiz) => {
          const best = storage.getBestScore(quiz.id);
          return best !== null && best >= 80;
        }).length,
        totalAttempts: attempts.length,
      }
    : null;

  // Get leaderboard with current user mixed in
  const leaderboard = getLeaderboard(currentUserStats);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
        {rank}
      </span>
    );
  };

  // Find current user's rank
  const currentUserRank = leaderboard.findIndex((entry) => entry.isCurrentUser) + 1;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you stack up against other learners
        </p>
      </div>

      {/* Current User Rank Highlight */}
      {currentUserStats && currentUserRank > 0 && (
        <Card className="p-6 bg-secondary/50 border-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-lg">
                {currentUserStats.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{currentUserStats.username}</p>
                <p className="text-sm text-muted-foreground">Your Ranking</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold">#{currentUserRank}</p>
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{currentUserStats.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{currentUserStats.quizzesMastered}</p>
                <p className="text-xs text-muted-foreground">Mastered</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Leaderboard Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <h2 className="font-semibold">Top Performers</h2>
        </div>
        <div className="divide-y divide-border">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            return (
              <div
                key={entry.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-secondary/50 border-l-4 border-l-foreground'
                    : 'hover:bg-secondary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      entry.isCurrentUser
                        ? 'bg-foreground text-background'
                        : 'bg-secondary'
                    }`}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-muted-foreground font-normal">(You)</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center w-16">
                    <p className="font-bold">{entry.averageScore}%</p>
                    <p className="text-xs text-muted-foreground">Avg</p>
                  </div>
                  <div className="text-center w-16">
                    <p className="font-bold">{entry.quizzesMastered}</p>
                    <p className="text-xs text-muted-foreground">Mastered</p>
                  </div>
                  <div className="text-center w-16">
                    <p className="font-bold">{entry.totalAttempts}</p>
                    <p className="text-xs text-muted-foreground">Attempts</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {!currentUserStats && (
        <p className="text-sm text-muted-foreground text-center">
          Complete some quizzes to see your ranking on the leaderboard!
        </p>
      )}
    </div>
  );
}
