import type { Quiz } from '../types';

export const quizzes: Quiz[] = [
  {
    id: 'agent-fundamentals',
    title: 'Agent Fundamentals',
    description: 'Test your knowledge of AI agent design and implementation',
    questions: [
      {
        id: 1,
        question: 'What is the primary purpose of an AI agent?',
        options: [
          'To replace human workers',
          'To autonomously perform tasks and make decisions',
          'To store large amounts of data',
          'To create visual interfaces',
        ],
        correctAnswer: 1,
        explanation:
          'AI agents are designed to autonomously perform tasks and make decisions based on their environment and goals.',
      },
      {
        id: 2,
        question: 'Which component is essential for an AI agent to learn from experience?',
        options: [
          'A graphical user interface',
          'A feedback mechanism',
          'A database connection',
          'A payment processor',
        ],
        correctAnswer: 1,
        explanation:
          'A feedback mechanism allows agents to learn from their actions and improve over time.',
      },
      {
        id: 3,
        question: "What is 'context window' in relation to AI models?",
        options: [
          'The browser window where AI runs',
          'The maximum amount of text a model can process at once',
          'The time period for model training',
          'The user interface for model configuration',
        ],
        correctAnswer: 1,
        explanation:
          'The context window defines how much information an AI model can consider in a single interaction.',
      },
      {
        id: 4,
        question: 'Which strategy helps manage limited context windows?',
        options: [
          'Adding more servers',
          'Using larger fonts',
          'Summarization and chunking',
          'Increasing screen resolution',
        ],
        correctAnswer: 2,
        explanation:
          'Summarization and chunking help fit relevant information within context limits.',
      },
      {
        id: 5,
        question: "What is 'prompt engineering'?",
        options: [
          'Building physical AI hardware',
          'Designing effective instructions for AI models',
          'Creating user interfaces',
          'Managing cloud infrastructure',
        ],
        correctAnswer: 1,
        explanation:
          'Prompt engineering is the practice of designing and optimizing inputs to get desired outputs from AI models.',
      },
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Master the art of crafting effective AI prompts',
    questions: [
      {
        id: 1,
        question: 'What is the main goal of prompt engineering?',
        options: [
          'To make prompts as long as possible',
          'To get consistent and accurate outputs from AI models',
          'To confuse the AI model',
          'To reduce AI processing time',
        ],
        correctAnswer: 1,
        explanation:
          'Prompt engineering aims to craft inputs that produce consistent, accurate, and useful outputs from AI models.',
      },
      {
        id: 2,
        question: 'Which technique involves showing the AI examples of desired outputs?',
        options: [
          'Zero-shot prompting',
          'Few-shot prompting',
          'Chain-of-thought prompting',
          'Negative prompting',
        ],
        correctAnswer: 1,
        explanation:
          'Few-shot prompting provides examples of input-output pairs to guide the AI model.',
      },
      {
        id: 3,
        question: "What is 'chain-of-thought' prompting?",
        options: [
          'Linking multiple AI models together',
          'Asking the AI to explain its reasoning step by step',
          'Creating a sequence of unrelated prompts',
          'Using blockchain for AI',
        ],
        correctAnswer: 1,
        explanation:
          'Chain-of-thought prompting encourages the model to break down complex problems into steps.',
      },
      {
        id: 4,
        question: 'Why is specificity important in prompts?',
        options: [
          'It makes prompts longer',
          'It reduces ambiguity and improves output quality',
          'It increases processing costs',
          'It confuses the AI',
        ],
        correctAnswer: 1,
        explanation:
          'Specific prompts reduce ambiguity, helping the AI understand exactly what output is expected.',
      },
      {
        id: 5,
        question: 'What is a system prompt?',
        options: [
          'An error message from the AI',
          'Instructions that set the AI behavior and context',
          'The first user message',
          'A debugging tool',
        ],
        correctAnswer: 1,
        explanation:
          'System prompts establish the AI role, tone, and constraints before user interaction begins.',
      },
    ],
  },
  {
    id: 'model-selection',
    title: 'Model Selection',
    description: 'Learn how to choose the right AI model for your task',
    questions: [
      {
        id: 1,
        question: 'What should you consider first when selecting an AI model?',
        options: [
          'The model with the highest price',
          'The specific task requirements and constraints',
          'The most popular model',
          'The newest model available',
        ],
        correctAnswer: 1,
        explanation:
          'Model selection should start with understanding your task requirements, constraints, and goals.',
      },
      {
        id: 2,
        question: 'What is the trade-off between model size and inference speed?',
        options: [
          'Larger models are always faster',
          'Larger models are typically slower but more capable',
          'Model size does not affect speed',
          'Smaller models are always less accurate',
        ],
        correctAnswer: 1,
        explanation:
          'Larger models generally offer better capabilities but require more compute and time for inference.',
      },
      {
        id: 3,
        question: 'When might you choose a smaller, specialized model over a large general model?',
        options: [
          'Never, larger is always better',
          'When you need faster responses and lower costs for specific tasks',
          'Only for testing purposes',
          'When accuracy does not matter',
        ],
        correctAnswer: 1,
        explanation:
          'Specialized smaller models can be more efficient and cost-effective for specific use cases.',
      },
      {
        id: 4,
        question: 'What is fine-tuning in the context of AI models?',
        options: [
          'Adjusting the volume of AI responses',
          'Training a pre-trained model on domain-specific data',
          'Making the model interface prettier',
          'Reducing the model size',
        ],
        correctAnswer: 1,
        explanation:
          'Fine-tuning adapts a pre-trained model to perform better on specific tasks or domains.',
      },
      {
        id: 5,
        question: 'What factor is most important for real-time applications?',
        options: [
          'Model accuracy only',
          'Latency and response time',
          'Training data size',
          'Model release date',
        ],
        correctAnswer: 1,
        explanation:
          'Real-time applications prioritize low latency to provide responsive user experiences.',
      },
    ],
  },
];
