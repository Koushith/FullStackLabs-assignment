// Quiz and Question types
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isCustom?: boolean;
}

// User answer tracking
export interface UserAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

// Quiz attempt/result
export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  isLearnMode?: boolean;
}

// User profile
export interface UserProfile {
  username: string;
  createdAt: string;
}

// User progress (stored in localStorage)
export interface UserProgress {
  profile: UserProfile | null;
  attempts: QuizAttempt[];
}

// Quiz category for home page
export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  isCustom?: boolean;
}
