// Runtime validation utilities for localStorage data

import type { UserProgress, Quiz, QuizAttempt, UserProfile, Question } from '../types';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function validateQuestion(data: unknown): data is Question {
  if (!isObject(data)) return false;

  return (
    isNumber(data.id) &&
    isString(data.question) &&
    isArray(data.options) &&
    data.options.every(isString) &&
    isNumber(data.correctAnswer) &&
    isString(data.explanation)
  );
}

export function validateQuiz(data: unknown): data is Quiz {
  if (!isObject(data)) return false;

  return (
    isString(data.id) &&
    isString(data.title) &&
    isString(data.description) &&
    isArray(data.questions) &&
    data.questions.every(validateQuestion) &&
    (data.isCustom === undefined || isBoolean(data.isCustom))
  );
}

export function validateUserProfile(data: unknown): data is UserProfile {
  if (!isObject(data)) return false;

  return (
    isString(data.username) &&
    isString(data.createdAt)
  );
}

export function validateQuizAttempt(data: unknown): data is QuizAttempt {
  if (!isObject(data)) return false;

  return (
    isString(data.id) &&
    isString(data.quizId) &&
    isString(data.quizTitle) &&
    isArray(data.answers) &&
    isNumber(data.score) &&
    isNumber(data.totalQuestions) &&
    isNumber(data.percentage) &&
    isString(data.completedAt)
  );
}

export function validateUserProgress(data: unknown): data is UserProgress {
  if (!isObject(data)) return false;

  const profile = data.profile;
  const attempts = data.attempts;

  if (profile !== null && !validateUserProfile(profile)) return false;
  if (!isArray(attempts)) return false;
  if (!attempts.every(validateQuizAttempt)) return false;

  return true;
}

export function validateQuizArray(data: unknown): data is Quiz[] {
  return isArray(data) && data.every(validateQuiz);
}

// Input sanitization - limits and trimming
export const INPUT_LIMITS = {
  USERNAME: 50,
  QUIZ_TITLE: 100,
  QUIZ_DESCRIPTION: 500,
  QUESTION_TEXT: 1000,
  OPTION_TEXT: 500,
  EXPLANATION_TEXT: 2000,
} as const;

export function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}
