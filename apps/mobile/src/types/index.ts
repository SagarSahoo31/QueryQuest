export interface TableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

export interface TableSchema {
  name: string;
  rowCount: number;
  columns: TableColumn[];
  sampleData: Record<string, any>[];
}

export interface DatabaseSchema {
  id: string;
  name: string;
  description: string;
  tables: TableSchema[];
}

export interface SQLExecutionResult {
  success: boolean;
  columns?: string[];
  rows?: any[][];
  rowCount?: number;
  executionTimeMs?: number;
  error?: {
    code: string;
    message: string;
    friendlyMessage: string;
    hint: string;
    suggestedFix?: string;
  };
}

export interface Exercise {
  id: string;
  type: 'predict' | 'fill' | 'write' | 'debug';
  question: string;
  codeSnippet?: string;
  options?: string[]; // for predict/multiple-choice
  blankInitialText?: string; // for fill-in-the-blank
  targetTable?: string;
  expectedQuery?: string;
  expectedResult?: {
    columns: string[];
    rows: any[][];
  };
  hints: string[];
  explanation: string;
  xp: number;
}

export interface Lesson {
  id: string;
  level: number;
  topicId: string;
  title: string;
  subtitle: string;
  description: string;
  conceptText: string;
  codeExample: string;
  codeExplanation: string;
  exercises: Exercise[];
  xpReward: number;
}

export interface LearningTopic {
  id: string;
  level: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
  iconName: string;
  lessons: Lesson[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xp: number;
  datasetId: string;
  targetTable: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  levelTitle: string;
  xp: number;
  streakDays: number;
  queriesExecuted: number;
  challengesCompleted: number;
  topicsMastered: number;
  totalTopics: number;
  masteryBreakdown: {
    topic: string;
    percentage: number;
  }[];
}
