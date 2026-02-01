import type { UserProgress, QuizAttempt, UserProfile, Quiz } from '../types';
import { validateUserProgress, validateQuizArray } from '../lib/validation';

const STORAGE_KEY = 'ai-dev-quiz-progress';
const CUSTOM_QUIZZES_KEY = 'ai-dev-quiz-custom-quizzes';

const getDefaultProgress = (): UserProgress => ({
  profile: null,
  attempts: [],
});

export const storage = {
  getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return getDefaultProgress();

      const parsed = JSON.parse(data);

      // Runtime validation
      if (!validateUserProgress(parsed)) {
        console.warn('Invalid user progress data in localStorage, resetting to default');
        return getDefaultProgress();
      }

      return parsed;
    } catch (error) {
      console.error('Error reading user progress from localStorage:', error);
      return getDefaultProgress();
    }
  },

  saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user progress to localStorage:', error);
    }
  },

  getProfile(): UserProfile | null {
    return this.getProgress().profile;
  },

  setProfile(profile: UserProfile): void {
    const progress = this.getProgress();
    progress.profile = profile;
    this.saveProgress(progress);
  },

  getAttempts(): QuizAttempt[] {
    return this.getProgress().attempts;
  },

  getAttemptsByQuiz(quizId: string): QuizAttempt[] {
    return this.getAttempts().filter((a) => a.quizId === quizId);
  },

  addAttempt(attempt: QuizAttempt): void {
    const progress = this.getProgress();
    progress.attempts.push(attempt);
    this.saveProgress(progress);
  },

  getBestScore(quizId: string): number | null {
    const attempts = this.getAttemptsByQuiz(quizId);
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map((a) => a.percentage));
  },

  clearProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user progress from localStorage:', error);
    }
  },

  // Custom quizzes
  getCustomQuizzes(): Quiz[] {
    try {
      const data = localStorage.getItem(CUSTOM_QUIZZES_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);

      // Runtime validation
      if (!validateQuizArray(parsed)) {
        console.warn('Invalid custom quizzes data in localStorage, returning empty array');
        return [];
      }

      return parsed;
    } catch (error) {
      console.error('Error reading custom quizzes from localStorage:', error);
      return [];
    }
  },

  saveCustomQuiz(quiz: Quiz): void {
    try {
      const quizzes = this.getCustomQuizzes();
      quizzes.push(quiz);
      localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(quizzes));
    } catch (error) {
      console.error('Error saving custom quiz to localStorage:', error);
    }
  },

  deleteCustomQuiz(quizId: string): void {
    try {
      const quizzes = this.getCustomQuizzes().filter((q) => q.id !== quizId);
      localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(quizzes));
    } catch (error) {
      console.error('Error deleting custom quiz from localStorage:', error);
    }
  },

  getCustomQuiz(quizId: string): Quiz | undefined {
    return this.getCustomQuizzes().find((q) => q.id === quizId);
  },
};
