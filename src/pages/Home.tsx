import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Trophy,
  Plus,
  Sparkles,
  Brain,
  TrendingUp,
  Zap,
  CheckCircle,
  Shuffle,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { QuizCard } from '../components/QuizCard';
import { FeatureCard } from '../components/FeatureCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { quizzes } from '../data/quizzes';
import { storage } from '../services/storage';

export function Home() {
  const [customQuizzes, setCustomQuizzes] = useState(() => storage.getCustomQuizzes());
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  const allQuizzes = [...quizzes, ...customQuizzes];
  const attempts = storage.getAttempts();
  const profile = storage.getProfile();

  const getQuizStats = (quizId: string) => {
    const quizAttempts = storage.getAttemptsByQuiz(quizId);
    const bestScore = storage.getBestScore(quizId);
    return { attempts: quizAttempts.length, bestScore };
  };

  const handleDeleteClick = (quizId: string) => {
    setDeleteQuizId(quizId);
  };

  const handleDeleteConfirm = () => {
    if (deleteQuizId) {
      storage.deleteCustomQuiz(deleteQuizId);
      setCustomQuizzes(customQuizzes.filter((q) => q.id !== deleteQuizId));
      setDeleteQuizId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteQuizId(null);
  };

  const quizToDelete = deleteQuizId
    ? customQuizzes.find((q) => q.id === deleteQuizId)
    : null;

  const masteredCount = allQuizzes.filter((q) => {
    const best = storage.getBestScore(q.id);
    return best !== null && best >= 80;
  }).length;

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
    : 0;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteQuizId !== null}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${quizToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />

      {/* Hero Section */}
      <section className="text-center space-y-6 py-8 sm:py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium">
          <Brain className="w-4 h-4" />
          AI Development Learning Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Master AI Development
          <span className="block text-muted-foreground mt-2">One Quiz at a Time</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Test your knowledge of AI agents, prompt engineering, and model selection.
          Track your progress, compete on the leaderboard, and become an AI development expert.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link to={`/quiz/${quizzes[0].id}`}>
            <Button size="lg" className="gap-2 text-base px-8">
              <Zap className="w-5 h-5" />
              Start Learning
            </Button>
          </Link>
          {!profile && (
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                Create Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        {attempts.length > 0 && (
          <div className="pt-6">
            <p className="text-sm text-muted-foreground mb-3">Your Progress</p>
            <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-secondary/50">
              <div className="text-center">
                <div className="text-2xl font-bold">{attempts.length}</div>
                <div className="text-xs text-muted-foreground">Attempts</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold">{avgScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold">{masteredCount}</div>
                <div className="text-xs text-muted-foreground">Mastered</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Why AI DevQuiz?</h2>
          <p className="text-muted-foreground">Everything you need to master AI development concepts</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={Brain}
            title="Expert Content"
            description="Curated questions on agents, prompts, and model selection"
          />
          <FeatureCard
            icon={GraduationCap}
            title="Learn Mode"
            description="See explanations before answering to learn as you go"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Track Progress"
            description="Monitor your scores and see improvement over time"
          />
          <FeatureCard
            icon={Sparkles}
            title="Create Quizzes"
            description="Build your own quizzes to test any topic"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">Get started in three simple steps</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold">Choose a Quiz</h3>
            <p className="text-sm text-muted-foreground">
              Select from our curated topics or create your own
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold">Answer Questions</h3>
            <p className="text-sm text-muted-foreground">
              Test your knowledge with instant feedback
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold">Track & Improve</h3>
            <p className="text-sm text-muted-foreground">
              Review explanations and retake to master topics
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Options Info */}
      <section className="rounded-2xl bg-secondary/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Customize Your Experience</h2>
            <p className="text-muted-foreground">
              Each quiz offers flexible options to match your learning style:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Shuffle Mode</p>
                  <p className="text-sm text-muted-foreground">Randomize question order for a fresh challenge each time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Learn Mode</p>
                  <p className="text-sm text-muted-foreground">See explanations before answering to reinforce learning</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-32 bg-border self-center" />
          <div className="flex-1 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Instant Feedback
            </h3>
            <p className="text-sm text-muted-foreground">
              Get immediate feedback on every answer with detailed explanations to help you understand the concepts.
            </p>
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Achievement Tracking
            </h3>
            <p className="text-sm text-muted-foreground">
              Earn "Mastered" badges when you score 80% or higher. Track your progress on the dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Categories */}
      <section className="space-y-6" id="quizzes">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Available Quizzes</h2>
            <p className="text-muted-foreground mt-1">
              {allQuizzes.length} quizzes · {allQuizzes.reduce((acc, q) => acc + q.questions.length, 0)} questions
            </p>
          </div>
          <Link to="/create-quiz">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Create Quiz
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {quizzes.map((quiz) => {
            const stats = getQuizStats(quiz.id);
            return (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                bestScore={stats.bestScore}
                attemptCount={stats.attempts}
              />
            );
          })}

          {customQuizzes.length > 0 && (
            <>
              <div className="flex items-center gap-3 pt-4">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  Your Custom Quizzes
                </h3>
              </div>
              {customQuizzes.map((quiz) => {
                const stats = getQuizStats(quiz.id);
                return (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    bestScore={stats.bestScore}
                    attemptCount={stats.attempts}
                    onDelete={handleDeleteClick}
                  />
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-8 sm:py-12 space-y-6 rounded-2xl bg-secondary/30">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to Test Your Knowledge?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Jump into a quiz and start learning. Track your progress and aim for mastery!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={`/quiz/${quizzes[0].id}`}>
            <Button size="lg" className="gap-2">
              <Zap className="w-5 h-5" />
              Take Your First Quiz
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button size="lg" variant="outline" className="gap-2">
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
