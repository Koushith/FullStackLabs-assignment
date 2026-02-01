import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Clock, Trash2, Sparkles, Target, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
  bestScore: number | null;
  attemptCount: number;
  onDelete?: (quizId: string) => void;
}

export function QuizCard({ quiz, bestScore, attemptCount, onDelete }: QuizCardProps) {
  const isMastered = bestScore !== null && bestScore >= 80;

  return (
    <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-semibold">{quiz.title}</h3>
            {quiz.isCustom && (
              <Badge variant="outline" className="gap-1">
                <Sparkles className="w-3 h-3" />
                Custom
              </Badge>
            )}
            {isMastered && (
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                <Trophy className="w-3 h-3 mr-1" />
                Mastered
              </Badge>
            )}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {quiz.description}
          </p>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {quiz.questions.length} questions
            </span>
            {bestScore !== null && (
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Best: {bestScore}%
              </span>
            )}
            {attemptCount > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-start">
          {quiz.isCustom && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(quiz.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              aria-label={`Delete ${quiz.title} quiz`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Link to={`/quiz/${quiz.id}`}>
            <Button className="gap-2">
              Start
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
