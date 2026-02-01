import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ChevronLeft, GripVertical } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { storage } from '../services/storage';
import { INPUT_LIMITS, sanitizeString } from '../lib/validation';
import type { Quiz } from '../types';

interface QuestionForm {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const emptyQuestion = (id: number): QuestionForm => ({
  id,
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
});

export function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion(1)]);
  const [errors, setErrors] = useState<string[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion(questions.length + 1)]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== index);
    // Re-number the questions
    setQuestions(updated.map((q, i) => ({ ...q, id: i + 1 })));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: unknown) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...updated[questionIndex].options];
    options[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push('Quiz title is required');
    }

    if (!description.trim()) {
      newErrors.push('Quiz description is required');
    }

    if (questions.length < 1) {
      newErrors.push('At least one question is required');
    }

    questions.forEach((q, i) => {
      if (!q.question.trim()) {
        newErrors.push(`Question ${i + 1}: Question text is required`);
      }
      const filledOptions = q.options.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        newErrors.push(`Question ${i + 1}: At least 2 options are required`);
      }
      if (!q.options[q.correctAnswer]?.trim()) {
        newErrors.push(`Question ${i + 1}: Correct answer option cannot be empty`);
      }
      if (!q.explanation.trim()) {
        newErrors.push(`Question ${i + 1}: Explanation is required`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const quiz: Quiz = {
      id: `custom-${crypto.randomUUID()}`,
      title: sanitizeString(title, INPUT_LIMITS.QUIZ_TITLE),
      description: sanitizeString(description, INPUT_LIMITS.QUIZ_DESCRIPTION),
      questions: questions.map((q) => ({
        id: q.id,
        question: sanitizeString(q.question, INPUT_LIMITS.QUESTION_TEXT),
        options: q.options.filter((o) => o.trim()).map((o) => sanitizeString(o, INPUT_LIMITS.OPTION_TEXT)),
        correctAnswer: q.correctAnswer,
        explanation: sanitizeString(q.explanation, INPUT_LIMITS.EXPLANATION_TEXT),
      })),
      isCustom: true,
    };

    storage.saveCustomQuiz(quiz);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Your Own Quiz</h1>
          <p className="text-muted-foreground">
            Design a custom quiz to test knowledge on any topic
          </p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="p-4 border-red-500 bg-red-500/10">
          <p className="font-medium text-red-500 mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside text-sm text-red-500 space-y-1">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Details */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Quiz Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Quiz Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Advanced React Patterns"
                maxLength={INPUT_LIMITS.QUIZ_TITLE}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Test your knowledge of advanced React concepts"
                maxLength={INPUT_LIMITS.QUIZ_DESCRIPTION}
              />
            </div>
          </div>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Questions ({questions.length})</h2>
            <Button type="button" variant="outline" onClick={addQuestion} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Question {qIndex + 1}</span>
                </div>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Question Text
                </label>
                <Input
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder="Enter your question"
                  maxLength={INPUT_LIMITS.QUESTION_TEXT}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Options (select the correct answer)
                </label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                      className="w-4 h-4"
                    />
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + oIndex)}
                    </span>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                      className="flex-1"
                      maxLength={INPUT_LIMITS.OPTION_TEXT}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Explanation (shown after answering)
                </label>
                <Input
                  value={question.explanation}
                  onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                  placeholder="Explain why this answer is correct"
                  maxLength={INPUT_LIMITS.EXPLANATION_TEXT}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link to="/">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit">Create Quiz</Button>
        </div>
      </form>
    </div>
  );
}
