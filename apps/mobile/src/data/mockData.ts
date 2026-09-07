import { DatabaseSchema, LearningTopic, UserProfile, Challenge, SQLExecutionResult } from '../types';

export const COLLEGE_DATABASE: DatabaseSchema = {
  id: 'college_db',
  name: 'College Database',
  description: 'Academic database containing student info, departments, courses, and marks.',
  tables: [
    {
      name: 'students',
      rowCount: 5,
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true },
        { name: 'name', type: 'TEXT' },
        { name: 'age', type: 'INTEGER' },
        { name: 'gender', type: 'TEXT' },
        { name: 'department_id', type: 'INTEGER', isFk: true },
        { name: 'email', type: 'TEXT' },
        { name: 'cgpa', type: 'NUMERIC' },
      ],
      sampleData: [
        { id: 1, name: 'Rahul Sharma', age: 20, gender: 'Male', department_id: 101, email: 'rahul@college.edu', cgpa: 8.7 },
        { id: 2, name: 'Ananya Verma', age: 21, gender: 'Female', department_id: 102, email: 'ananya@college.edu', cgpa: 9.1 },
        { id: 3, name: 'Arjun Patel', age: 19, gender: 'Male', department_id: 101, email: 'arjun@college.edu', cgpa: 7.9 },
        { id: 4, name: 'Priya Nair', age: 22, gender: 'Female', department_id: 103, email: 'priya@college.edu', cgpa: 8.9 },
        { id: 5, name: 'Siddharth Rao', age: 20, gender: 'Male', department_id: 102, email: 'siddharth@college.edu', cgpa: 8.2 },
      ],
    },
    {
      name: 'departments',
      rowCount: 3,
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true },
        { name: 'name', type: 'TEXT' },
        { name: 'hod', type: 'TEXT' },
        { name: 'location', type: 'TEXT' },
      ],
      sampleData: [
        { id: 101, name: 'Computer Science', hod: 'Dr. A. Gupta', location: 'Block A' },
        { id: 102, name: 'Electronics & Comm', hod: 'Dr. S. Mehta', location: 'Block B' },
        { id: 103, name: 'Information Tech', hod: 'Dr. R. Joshi', location: 'Block C' },
      ],
    },
    {
      name: 'courses',
      rowCount: 4,
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true },
        { name: 'name', type: 'TEXT' },
        { name: 'credits', type: 'INTEGER' },
        { name: 'department_id', type: 'INTEGER', isFk: true },
      ],
      sampleData: [
        { id: 301, name: 'Database Management', credits: 4, department_id: 101 },
        { id: 302, name: 'Data Structures', credits: 4, department_id: 101 },
        { id: 303, name: 'Digital Signal Processing', credits: 3, department_id: 102 },
        { id: 304, name: 'Web Engineering', credits: 3, department_id: 103 },
      ],
    },
    {
      name: 'enrollments',
      rowCount: 5,
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true },
        { name: 'student_id', type: 'INTEGER', isFk: true },
        { name: 'course_id', type: 'INTEGER', isFk: true },
        { name: 'semester', type: 'TEXT' },
        { name: 'marks', type: 'INTEGER' },
      ],
      sampleData: [
        { id: 1, student_id: 1, course_id: 301, semester: 'Sem 4', marks: 88 },
        { id: 2, student_id: 2, course_id: 303, semester: 'Sem 6', marks: 94 },
        { id: 3, student_id: 3, course_id: 301, semester: 'Sem 4', marks: 76 },
        { id: 4, student_id: 4, course_id: 304, semester: 'Sem 8', marks: 91 },
        { id: 5, student_id: 5, course_id: 302, semester: 'Sem 4', marks: 82 },
      ],
    },
    {
      name: 'professors',
      rowCount: 3,
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true },
        { name: 'name', type: 'TEXT' },
        { name: 'department_id', type: 'INTEGER', isFk: true },
        { name: 'experience', type: 'INTEGER' },
      ],
      sampleData: [
        { id: 1, name: 'Dr. A. Gupta', department_id: 101, experience: 14 },
        { id: 2, name: 'Dr. S. Mehta', department_id: 102, experience: 10 },
        { id: 3, name: 'Dr. R. Joshi', department_id: 103, experience: 8 },
      ],
    },
  ],
};

export const MOCK_USER: UserProfile = {
  name: 'Alex Kumar',
  levelTitle: 'Query Explorer',
  xp: 2450,
  streakDays: 8,
  queriesExecuted: 146,
  challengesCompleted: 32,
  topicsMastered: 18,
  totalTopics: 25,
  masteryBreakdown: [
    { topic: 'SELECT', percentage: 95 },
    { topic: 'WHERE', percentage: 82 },
    { topic: 'GROUP BY', percentage: 61 },
    { topic: 'JOINS', percentage: 43 },
    { topic: 'SUBQUERIES', percentage: 18 },
  ],
};

export const CURRICULUM_TOPICS: LearningTopic[] = [
  {
    id: 'lvl_0',
    level: 0,
    title: 'Database Fundamentals',
    description: 'Understand tables, rows, columns, and key concepts.',
    status: 'completed',
    progressPercentage: 100,
    totalLessons: 3,
    completedLessons: 3,
    iconName: 'database',
    lessons: [],
  },
  {
    id: 'lvl_1',
    level: 1,
    title: 'SQL Basics (SELECT & FROM)',
    description: 'Learn how to choose columns and fetch data from tables.',
    status: 'completed',
    progressPercentage: 100,
    totalLessons: 4,
    completedLessons: 4,
    iconName: 'terminal',
    lessons: [
      {
        id: 'lesson_select_1',
        level: 1,
        topicId: 'lvl_1',
        title: 'Your First SELECT',
        subtitle: 'Retrieving data from a database table',
        description: 'SELECT tells SQL which columns you want to see from a table.',
        conceptText: 'Think of a database table like an Excel sheet. SELECT picks the columns you want to view, and FROM specifies which table to look inside.',
        codeExample: 'SELECT name, age FROM students;',
        codeExplanation: '• SELECT name, age -> columns we want\n• FROM students -> table containing data\n• ; -> completes the SQL statement',
        xpReward: 50,
        exercises: [
          {
            id: 'ex_1',
            type: 'predict',
            question: 'What will this query return?',
            codeSnippet: 'SELECT name, cgpa FROM students;',
            options: [
              'All columns (id, name, age, gender, email, cgpa)',
              'Only the "name" and "cgpa" columns for all students',
              'Only students with CGPA > 8.0',
            ],
            hints: ['Look at the column names right after SELECT.'],
            explanation: 'SELECT name, cgpa extracts only those two columns for every row in the students table.',
            xp: 20,
          },
          {
            id: 'ex_2',
            type: 'write',
            question: 'Write a SQL query to display the name and email of all students from the students table.',
            targetTable: 'students',
            expectedQuery: 'SELECT name, email FROM students;',
            expectedResult: {
              columns: ['name', 'email'],
              rows: [
                ['Rahul Sharma', 'rahul@college.edu'],
                ['Ananya Verma', 'ananya@college.edu'],
                ['Arjun Patel', 'arjun@college.edu'],
                ['Priya Nair', 'priya@college.edu'],
                ['Siddharth Rao', 'siddharth@college.edu'],
              ],
            },
            hints: [
              'Start with SELECT followed by column names.',
              'Use a comma between column names: name, email.',
              'End with FROM students;',
            ],
            explanation: 'Great job! SELECT name, email FROM students; fetches student names and email addresses.',
            xp: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'lvl_2',
    level: 2,
    title: 'Filtering Data (WHERE)',
    description: 'Filter specific rows using comparisons, AND, OR, and LIKE.',
    status: 'current',
    progressPercentage: 80,
    totalLessons: 5,
    completedLessons: 4,
    iconName: 'filter',
    lessons: [],
  },
  {
    id: 'lvl_3',
    level: 3,
    title: 'SQL Functions & Aggregates',
    description: 'COUNT, SUM, AVG, MIN, MAX, and String helpers.',
    status: 'current',
    progressPercentage: 40,
    totalLessons: 4,
    completedLessons: 2,
    iconName: 'calculator',
    lessons: [],
  },
  {
    id: 'lvl_4',
    level: 4,
    title: 'Grouping Data (GROUP BY)',
    description: 'Group rows into summary statistics with GROUP BY and HAVING.',
    status: 'locked',
    progressPercentage: 0,
    totalLessons: 4,
    completedLessons: 0,
    iconName: 'layers',
    lessons: [],
  },
  {
    id: 'lvl_5',
    level: 5,
    title: 'Relational Joins (INNER, LEFT)',
    description: 'Combine data across multiple tables using foreign keys.',
    status: 'locked',
    progressPercentage: 0,
    totalLessons: 6,
    completedLessons: 0,
    iconName: 'git-merge',
    lessons: [],
  },
  {
    id: 'lvl_6',
    level: 6,
    title: 'Subqueries & Nested Queries',
    description: 'Write scalar, IN, and EXISTS nested queries.',
    status: 'locked',
    progressPercentage: 0,
    totalLessons: 4,
    completedLessons: 0,
    iconName: 'corner-down-right',
    lessons: [],
  },
];

export const DAILY_CHALLENGE: Challenge = {
  id: 'daily_2026_09_07',
  title: 'Top Performing CSE Students',
  description: 'Find the name and CGPA of all students in Computer Science (department_id = 101) with CGPA >= 8.0 sorted by CGPA descending.',
  difficulty: 'Intermediate',
  xp: 50,
  datasetId: 'college_db',
  targetTable: 'students',
  completed: false,
};

export const MOCK_CHALLENGES: Challenge[] = [
  DAILY_CHALLENGE,
  {
    id: 'ch_2',
    title: 'High Credit Courses',
    description: 'Find all courses offering 4 credits.',
    difficulty: 'Beginner',
    xp: 30,
    datasetId: 'college_db',
    targetTable: 'courses',
    completed: true,
  },
  {
    id: 'ch_3',
    title: 'Department Head Count',
    description: 'Count how many total students belong to department 102.',
    difficulty: 'Intermediate',
    xp: 40,
    datasetId: 'college_db',
    targetTable: 'students',
    completed: false,
  },
];

// Lightweight SQL Client-side Execution Simulator for immediate UI sandbox feel
export function mockExecuteSQL(queryText: string): SQLExecutionResult {
  const trimmed = queryText.trim();
  const startTime = Date.now();

  if (!trimmed) {
    return {
      success: false,
      error: {
        code: 'EMPTY_QUERY',
        message: 'Query is empty.',
        friendlyMessage: '❌ Please write a SQL statement before clicking Run.',
        hint: 'Try writing: SELECT * FROM students;',
      },
    };
  }

  // Check for common typos (e.g. FORM instead of FROM)
  if (/\bFORM\b/i.test(trimmed)) {
    return {
      success: false,
      error: {
        code: 'SYNTAX_ERROR',
        message: 'syntax error at or near "FORM"',
        friendlyMessage: '❌ Typo detected! It looks like SQL expected FROM, but found FORM.',
        hint: 'Did you mean: FROM students;',
        suggestedFix: trimmed.replace(/\bFORM\b/gi, 'FROM'),
      },
    };
  }

  // Check if FROM keyword is missing in SELECT query
  if (/^SELECT\b/i.test(trimmed) && !/\bFROM\b/i.test(trimmed)) {
    return {
      success: false,
      error: {
        code: 'MISSING_FROM',
        message: 'syntax error: expected FROM',
        friendlyMessage: '❌ Missing FROM clause in your query.',
        hint: 'Specify which table to retrieve data from: SELECT ... FROM <table_name>;',
      },
    };
  }

  const upper = trimmed.toUpperCase();

  // Match: SELECT * FROM students;
  if (upper.includes('FROM STUDENTS')) {
    let rows = COLLEGE_DATABASE.tables[0].sampleData;
    let cols = ['id', 'name', 'age', 'gender', 'department_id', 'email', 'cgpa'];

    // Specific column filtering
    if (upper.includes('NAME, AGE') || upper.includes('AGE, NAME')) {
      cols = ['name', 'age'];
      rows = rows.map((r) => ({ name: r.name, age: r.age }));
    } else if (upper.includes('NAME, CGPA')) {
      cols = ['name', 'cgpa'];
      rows = rows.map((r) => ({ name: r.name, cgpa: r.cgpa }));
    } else if (upper.includes('NAME, EMAIL')) {
      cols = ['name', 'email'];
      rows = rows.map((r) => ({ name: r.name, email: r.email }));
    }

    // WHERE filtering
    if (upper.includes('WHERE AGE > 18') || upper.includes('WHERE AGE >= 20')) {
      rows = rows.filter((r) => r.age >= 20);
    } else if (upper.includes("WHERE DEPARTMENT = 'CSE'") || upper.includes('DEPARTMENT_ID = 101')) {
      rows = rows.filter((r) => r.department_id === 101);
    }

    const formattedRows = rows.map((r) => cols.map((c) => r[c]));

    return {
      success: true,
      columns: cols,
      rows: formattedRows,
      rowCount: formattedRows.length,
      executionTimeMs: Math.floor(Math.random() * 8) + 3,
    };
  }

  // Match: SELECT * FROM departments
  if (upper.includes('FROM DEPARTMENTS')) {
    const table = COLLEGE_DATABASE.tables[1];
    const cols = ['id', 'name', 'hod', 'location'];
    const rows = table.sampleData.map((r) => cols.map((c) => r[c]));

    return {
      success: true,
      columns: cols,
      rows: rows,
      rowCount: rows.length,
      executionTimeMs: Math.floor(Math.random() * 6) + 2,
    };
  }

  // Match: SELECT * FROM courses
  if (upper.includes('FROM COURSES')) {
    const table = COLLEGE_DATABASE.tables[2];
    const cols = ['id', 'name', 'credits', 'department_id'];
    const rows = table.sampleData.map((r) => cols.map((c) => r[c]));

    return {
      success: true,
      columns: cols,
      rows: rows,
      rowCount: rows.length,
      executionTimeMs: Math.floor(Math.random() * 6) + 2,
    };
  }

  // Generic fallback query output
  return {
    success: true,
    columns: ['id', 'name', 'status'],
    rows: [
      [1, 'QueryResult_A', 'Active'],
      [2, 'QueryResult_B', 'Completed'],
    ],
    rowCount: 2,
    executionTimeMs: Date.now() - startTime + 5,
  };
}
