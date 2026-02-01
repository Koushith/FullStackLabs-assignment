import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, RefreshCw, Home, ChevronDown, ChevronUp, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { storage } from '../services/storage';
import { quizzes } from '../data/quizzes';

function getPerformanceMessage(percentage: number): { message: string; emoji: string } {
  if (percentage === 100) {
    return { message: 'Perfect score! You\'re an expert!', emoji: '🎉' };
  }
  if (percentage >= 80) {
    return { message: 'Excellent work! You\'ve mastered this topic.', emoji: '🌟' };
  }
  if (percentage >= 60) {
    return { message: 'Good job! You\'re getting there.', emoji: '👍' };
  }
  if (percentage >= 40) {
    return { message: 'Keep practicing! You\'re making progress.', emoji: '💪' };
  }
  return { message: 'Needs review. Try again to improve!', emoji: '📚' };
}

export function Results() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [showReview, setShowReview] = useState(false);

  const attempts = storage.getAttempts();
  const attempt = attempts.find((a) => a.id === attemptId);

  if (!attempt) {
    return (
      <div className="text-center space-y-4 py-12">
        <h1 className="text-2xl font-bold">Results not found</h1>
        <p className="text-muted-foreground">
          The quiz results you're looking for don't exist.
        </p>
        <Link to="/">
          <Button>Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  // Look in both built-in and custom quizzes
  const quiz = quizzes.find((q) => q.id === attempt.quizId) || storage.getCustomQuiz(attempt.quizId);
  const performance = getPerformanceMessage(attempt.percentage);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Results Card */}
      <Card className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-secondary flex items-center justify-center">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Quiz Complete!</h1>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <p className="text-muted-foreground">{attempt.quizTitle}</p>
            {attempt.isLearnMode && (
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="w-3 h-3" />
                Learn Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="py-4 sm:py-6">
          <div
            className="text-5xl sm:text-6xl font-bold"
            role="status"
            aria-label={`Your score: ${attempt.percentage} percent`}
          >
            {attempt.percentage}%
          </div>
          <div className="text-base sm:text-lg text-muted-foreground mt-2">
            {attempt.score} of {attempt.totalQuestions} correct
          </div>
        </div>

        {/* Performance Message */}
        <div className="text-base sm:text-lg" role="status">
          <span className="mr-2" aria-hidden="true">{performance.emoji}</span>
          {performance.message}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-2 sm:pt-4">
          <Link to={`/quiz/${attempt.quizId}`} className="w-full sm:w-auto">
            <Button variant="outline" className="gap-2 w-full">
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Retake Quiz
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button className="gap-2 w-full">
              <Home className="w-4 h-4" aria-hidden="true" />
              Back to Quizzes
            </Button>
          </Link>
        </div>
      </Card>

      {/* Review Section */}
      {quiz && (
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            aria-expanded={showReview}
            aria-controls="review-section"
          >
            <span className="font-medium">Review Your Answers</span>
            {showReview ? (
              <ChevronUp className="w-5 h-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          {showReview && (
            <div id="review-section" className="border-t border-border">
              {quiz.questions.map((question, index) => {
                const answer = attempt.answers.find(
                  (a) => a.questionId === question.id
                );
                const isCorrect = answer?.isCorrect ?? false;

                return (
                  <div
                    key={question.id}
                    className="p-3 sm:p-4 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                        aria-label={isCorrect ? 'Correct' : 'Incorrect'}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          {index + 1}. {question.question}
                        </p>
                        <div className="text-xs sm:text-sm space-y-1">
                          {answer && !isCorrect && (
                            <p className="text-red-500">
                              Your answer:{' '}
                              {question.options[answer.selectedAnswer]}
                            </p>
                          )}
                          <p className="text-green-600">
                            Correct answer:{' '}
                            {question.options[question.correctAnswer]}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
