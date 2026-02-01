import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Trophy, Target, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { StatCard } from '../components/StatCard';
import { storage } from '../services/storage';
import { quizzes } from '../data/quizzes';
import { INPUT_LIMITS } from '../lib/validation';

export function Dashboard() {
  const [profile, setProfile] = useState(storage.getProfile());
  const [username, setUsername] = useState('');
  const attempts = storage.getAttempts();
  const customQuizzes = storage.getCustomQuizzes();
  const allQuizzes = [...quizzes, ...customQuizzes];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const newProfile = {
      username: username.trim(),
      createdAt: new Date().toISOString(),
    };
    storage.setProfile(newProfile);
    setProfile(newProfile);
    setUsername('');
  };

  // Calculate stats
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.reduce((acc, a) => acc + a.score, 0);
  const totalQuestions = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts
        )
      : 0;
  const quizzesMastered = allQuizzes.filter((quiz) => {
    const best = storage.getBestScore(quiz.id);
    return best !== null && best >= 80;
  }).length;

  // Recent attempts (last 5)
  const recentAttempts = [...attempts]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 5);

  // Best scores per quiz (all quizzes)
  const bestScores = allQuizzes.map((quiz) => ({
    quiz,
    bestScore: storage.getBestScore(quiz.id),
    attempts: storage.getAttemptsByQuiz(quiz.id).length,
  }));

  if (!profile) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Create Your Profile</h1>
          <p className="text-muted-foreground">
            Enter a username to track your quiz progress and see your stats.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                maxLength={INPUT_LIMITS.USERNAME}
              />
            </div>
            <Button type="submit" className="w-full">
              Create Profile
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile.username}!</h1>
          <p className="text-muted-foreground">
            Here's your learning progress overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Target} value={totalAttempts} label="Total Attempts" />
        <StatCard icon={TrendingUp} value={`${averageScore}%`} label="Average Score" />
        <StatCard icon={Clock} value={`${totalCorrect}/${totalQuestions}`} label="Questions Correct" />
        <StatCard icon={Trophy} value={quizzesMastered} label="Quizzes Mastered" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Best Scores */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quiz Progress</h2>
          <div className="space-y-4">
            {bestScores.map(({ quiz, bestScore, attempts }) => (
              <div key={quiz.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{quiz.title}</span>
                    {quiz.isCustom && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Sparkles className="w-3 h-3" />
                        Custom
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {bestScore !== null ? `Best: ${bestScore}%` : 'Not attempted'}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      bestScore !== null && bestScore >= 80
                        ? 'bg-green-500'
                        : bestScore !== null && bestScore >= 60
                        ? 'bg-yellow-500'
                        : 'bg-muted-foreground'
                    }`}
                    style={{ width: `${bestScore ?? 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {attempts} attempt{attempts !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
            {bestScores.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No quizzes available yet.
              </p>
            )}
          </div>
        </Card>

        {/* Recent Attempts */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {recentAttempts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No quizzes taken yet.</p>
              <Link to="/">
                <Button variant="outline" className="mt-4">
                  Start a Quiz
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <Link
                  key={attempt.id}
                  to={`/results/${attempt.id}`}
                  className="block p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{attempt.quizTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        attempt.percentage >= 80
                          ? 'text-green-500'
                          : attempt.percentage >= 60
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {attempt.percentage}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
