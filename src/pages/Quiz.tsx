import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, XCircle, Shuffle, BookOpen, Play } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { quizzes } from '../data/quizzes';
import { storage } from '../services/storage';
import type { UserAnswer, Question } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Quiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  // Look in both built-in and custom quizzes
  const quiz = quizzes.find((q) => q.id === quizId) || storage.getCustomQuiz(quizId ?? '');

  // Quiz settings (before starting)
  const [hasStarted, setHasStarted] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [learnMode, setLearnMode] = useState(false);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  // Memoize shuffled questions so they don't change during the quiz
  const questions: Question[] = useMemo(() => {
    if (!quiz) return [];
    return shuffleQuestions ? shuffleArray(quiz.questions) : quiz.questions;
  }, [quiz, shuffleQuestions, hasStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!quiz) {
    return (
      <div className="text-center space-y-4 py-12">
        <h1 className="text-2xl font-bold">Quiz not found</h1>
        <p className="text-muted-foreground">
          The quiz you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  // Start screen
  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Quizzes
        </Link>

        <Card className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground">{quiz.description}</p>
            <p className="text-sm text-muted-foreground">
              {quiz.questions.length} questions
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Quiz Options
            </h2>

            <button
              onClick={() => setShuffleQuestions(!shuffleQuestions)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                shuffleQuestions
                  ? 'border-foreground bg-secondary'
                  : 'border-border hover:border-muted-foreground'
              }`}
              aria-pressed={shuffleQuestions}
            >
              <div className="flex items-center gap-3">
                <Shuffle className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">Shuffle Questions</p>
                  <p className="text-sm text-muted-foreground">
                    Randomize the order of questions
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    shuffleQuestions ? 'bg-foreground border-foreground' : 'border-muted-foreground'
                  }`}
                >
                  {shuffleQuestions && <CheckCircle2 className="w-4 h-4 text-background" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode(!learnMode)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                learnMode
                  ? 'border-foreground bg-secondary'
                  : 'border-border hover:border-muted-foreground'
              }`}
              aria-pressed={learnMode}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">Learn Mode</p>
                  <p className="text-sm text-muted-foreground">
                    See explanations before answering
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    learnMode ? 'bg-foreground border-foreground' : 'border-muted-foreground'
                  }`}
                >
                  {learnMode && <CheckCircle2 className="w-4 h-4 text-background" />}
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={() => setHasStarted(true)}
            className="w-full gap-2"
            size="lg"
          >
            <Play className="w-4 h-4" />
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const answer: UserAnswer = {
      questionId: question.id,
      selectedAnswer,
      isCorrect,
    };

    setAnswers([...answers, answer]);
    setHasAnswered(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const finalAnswers = [...answers];
      const score = finalAnswers.filter((a) => a.isCorrect).length;
      const percentage = Math.round((score / questions.length) * 100);

      const attempt = {
        id: crypto.randomUUID(),
        quizId: quiz.id,
        quizTitle: quiz.title,
        answers: finalAnswers,
        score,
        totalQuestions: questions.length,
        percentage,
        completedAt: new Date().toISOString(),
        isLearnMode: learnMode,
      };

      storage.addAttempt(attempt);
      navigate(`/results/${attempt.id}`);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  };

  const getOptionClasses = (index: number) => {
    const base =
      'w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground';

    if (!hasAnswered) {
      if (selectedAnswer === index) {
        return `${base} border-foreground bg-secondary`;
      }
      return `${base} border-border hover:border-muted-foreground cursor-pointer`;
    }

    if (index === question.correctAnswer) {
      return `${base} border-green-500 bg-green-500/10`;
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return `${base} border-red-500 bg-red-500/10`;
    }

    return `${base} border-border opacity-50`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Exit quiz and return to home"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Exit Quiz</span>
          <span className="sm:hidden">Exit</span>
        </Link>
        <span className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">Question </span>
          {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 bg-secondary rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label={`Question ${currentIndex + 1} of ${questions.length}`}
      >
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Quiz Title & Mode Indicators */}
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-lg sm:text-xl font-semibold">{quiz.title}</h1>
        {learnMode && (
          <span className="inline-flex items-center gap-1 text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded-full">
            <BookOpen className="w-3 h-3" />
            Learn Mode
          </span>
        )}
        {shuffleQuestions && (
          <span className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full">
            <Shuffle className="w-3 h-3" />
            Shuffled
          </span>
        )}
      </div>

      {/* Learn Mode: Show explanation first */}
      {learnMode && !hasAnswered && (
        <div className="p-4 rounded-xl bg-blue-500/10 border-2 border-blue-500/30">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Learn First</p>
              <p className="text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Question */}
      <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-base sm:text-lg font-medium">{question.question}</h2>

        {/* Options */}
        <div className="space-y-2 sm:space-y-3" role="radiogroup" aria-label="Answer options">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={hasAnswered}
              className={getOptionClasses(index)}
              role="radio"
              aria-checked={selectedAnswer === index}
              aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-current flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-sm sm:text-base">{option}</span>
                {hasAnswered && index === question.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-label="Correct answer" />
                )}
                {hasAnswered &&
                  selectedAnswer === index &&
                  index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" aria-label="Incorrect answer" />
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation (after answering) */}
        {hasAnswered && (
          <div className={`p-3 sm:p-4 rounded-lg ${
            selectedAnswer === question.correctAnswer
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <p className={`text-sm font-medium mb-1 ${
              selectedAnswer === question.correctAnswer ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-sm text-muted-foreground">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          {!hasAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full sm:w-auto"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full sm:w-auto">
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
