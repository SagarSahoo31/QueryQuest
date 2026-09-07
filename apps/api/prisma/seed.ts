import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Courses
  const fundamentalsCourse = await prisma.course.upsert({
    where: { slug: 'sql-fundamentals' },
    update: {},
    create: {
      title: 'SQL Fundamentals',
      slug: 'sql-fundamentals',
      description: 'Learn SQL from scratch. Perfect for beginners with no prior database experience.',
      difficulty: 'beginner',
      orderIndex: 1,
      isPublished: true,
    },
  });

  console.log('Created course:', fundamentalsCourse.title);

  // Create Modules
  const basicsModule = await prisma.module.upsert({
    where: { slug: 'database-basics' },
    update: {},
    create: {
      courseId: fundamentalsCourse.id,
      title: 'Database Basics',
      slug: 'database-basics',
      description: 'Understanding what databases are and how they work',
      orderIndex: 1,
      isLocked: false,
    },
  });

  const selectModule = await prisma.module.upsert({
    where: { slug: 'select-basics' },
    update: {},
    create: {
      courseId: fundamentalsCourse.id,
      title: 'SELECT Basics',
      slug: 'select-basics',
      description: 'Learn to retrieve data from tables',
      orderIndex: 2,
      isLocked: false,
    },
  });

  const whereModule = await prisma.module.upsert({
    where: { slug: 'where-clause' },
    update: {},
    create: {
      courseId: fundamentalsCourse.id,
      title: 'Filtering with WHERE',
      slug: 'where-clause',
      description: 'Learn to filter query results',
      orderIndex: 3,
      isLocked: false,
    },
  });

  console.log('Created modules');

  // Create Lessons
  const lesson1 = await prisma.lesson.upsert({
    where: { slug: 'what-is-database' },
    update: {},
    create: {
      moduleId: basicsModule.id,
      title: 'What is a Database?',
      slug: 'what-is-database',
      description: 'Learn what databases are and why we use them',
      content: {
        sections: [
          {
            type: 'explanation',
            title: 'What is a Database?',
            content: 'A database is an organized collection of data, stored and accessed electronically. Think of it like a super-powered spreadsheet that can store millions of rows and handle complex queries.',
          },
          {
            type: 'explanation',
            title: 'Why Do We Need Databases?',
            content: 'Databases help us store, organize, and retrieve data efficiently. From your college student records to online shopping carts, databases power almost every application you use.',
          },
        ],
      },
      orderIndex: 1,
      xpReward: 10,
      estimatedTime: 5,
      isLocked: false,
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { slug: 'first-select' },
    update: {},
    create: {
      moduleId: selectModule.id,
      title: 'Your First SELECT',
      slug: 'first-select',
      description: 'Write your first SQL query',
      content: {
        sections: [
          {
            type: 'explanation',
            title: 'What is SELECT?',
            content: 'SELECT tells SQL which columns you want to see from a table. It\'s the most common SQL command.',
          },
          {
            type: 'code',
            content: {
              language: 'sql',
              code: 'SELECT name, age FROM students;',
              explanation: 'This query selects the name and age columns from the students table.',
            },
          },
        ],
      },
      orderIndex: 1,
      xpReward: 15,
      estimatedTime: 10,
      isLocked: false,
    },
  });

  console.log('Created lessons');

  // Create Exercises
  await prisma.exercise.upsert({
    where: { id: 'exercise-select-1' },
    update: {},
    create: {
      id: 'exercise-select-1',
      lessonId: lesson2.id,
      type: 'MULTIPLE_CHOICE',
      title: 'What does SELECT do?',
      description: 'Choose the correct answer',
      content: {
        question: 'Which SQL keyword is used to choose which columns to retrieve?',
        options: [
          { id: 'a', text: 'FROM', isCorrect: false },
          { id: 'b', text: 'SELECT', isCorrect: true },
          { id: 'c', text: 'WHERE', isCorrect: false },
          { id: 'd', text: 'TABLE', isCorrect: false },
        ],
      },
      solution: 'b',
      explanation: 'SELECT is used to specify which columns you want to retrieve from a table.',
      xpReward: 5,
      difficulty: 'easy',
      orderIndex: 1,
    },
  });

  await prisma.exercise.upsert({
    where: { id: 'exercise-select-2' },
    update: {},
    create: {
      id: 'exercise-select-2',
      lessonId: lesson2.id,
      type: 'FILL_BLANK',
      title: 'Complete the Query',
      description: 'Fill in the blanks to complete the SQL query',
      content: {
        template: '___ name FROM students;',
        blanks: [
          {
            id: 'blank1',
            correctAnswer: 'SELECT',
            acceptableAnswers: ['select'],
          },
        ],
      },
      solution: 'SELECT name FROM students;',
      explanation: 'SELECT is used before the column names to specify what data to retrieve.',
      xpReward: 5,
      difficulty: 'easy',
      orderIndex: 2,
    },
  });

  console.log('Created exercises');

  // Create Datasets
  const collegeDataset = await prisma.dataset.upsert({
    where: { slug: 'college-db' },
    update: {},
    create: {
      name: 'College Database',
      slug: 'college-db',
      description: 'A typical college database with students, courses, and enrollments',
      icon: 'graduation-cap',
      difficulty: 'beginner',
      isActive: true,
      orderIndex: 1,
    },
  });

  console.log('Created dataset:', collegeDataset.name);

  // Create Dataset Tables
  await prisma.datasetTable.upsert({
    where: { datasetId_name: { datasetId: collegeDataset.id, name: 'students' } },
    update: {},
    create: {
      datasetId: collegeDataset.id,
      name: 'students',
      schema: [
        { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY'] },
        { name: 'name', type: 'TEXT', constraints: ['NOT NULL'] },
        { name: 'age', type: 'INTEGER' },
        { name: 'email', type: 'TEXT', constraints: ['UNIQUE'] },
        { name: 'department_id', type: 'INTEGER', constraints: ['REFERENCES departments(id)'] },
        { name: 'cgpa', type: 'DECIMAL(3,2)' },
      ],
      sampleData: [
        { id: 1, name: 'Rahul Sharma', age: 20, email: 'rahul@college.edu', department_id: 1, cgpa: 8.5 },
        { id: 2, name: 'Priya Patel', age: 21, email: 'priya@college.edu', department_id: 1, cgpa: 9.2 },
        { id: 3, name: 'Arjun Singh', age: 19, email: 'arjun@college.edu', department_id: 2, cgpa: 7.8 },
      ],
      rowCount: 50,
      orderIndex: 1,
    },
  });

  await prisma.datasetTable.upsert({
    where: { datasetId_name: { datasetId: collegeDataset.id, name: 'departments' } },
    update: {},
    create: {
      datasetId: collegeDataset.id,
      name: 'departments',
      schema: [
        { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY'] },
        { name: 'name', type: 'TEXT', constraints: ['NOT NULL'] },
        { name: 'hod', type: 'TEXT' },
        { name: 'location', type: 'TEXT' },
      ],
      sampleData: [
        { id: 1, name: 'Computer Science', hod: 'Dr. Kumar', location: 'Building A' },
        { id: 2, name: 'Electronics', hod: 'Dr. Sharma', location: 'Building B' },
        { id: 3, name: 'Mechanical', hod: 'Dr. Verma', location: 'Building C' },
      ],
      rowCount: 5,
      orderIndex: 2,
    },
  });

  await prisma.datasetTable.upsert({
    where: { datasetId_name: { datasetId: collegeDataset.id, name: 'courses' } },
    update: {},
    create: {
      datasetId: collegeDataset.id,
      name: 'courses',
      schema: [
        { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY'] },
        { name: 'name', type: 'TEXT', constraints: ['NOT NULL'] },
        { name: 'credits', type: 'INTEGER' },
        { name: 'department_id', type: 'INTEGER', constraints: ['REFERENCES departments(id)'] },
      ],
      sampleData: [
        { id: 1, name: 'Database Systems', credits: 4, department_id: 1 },
        { id: 2, name: 'Data Structures', credits: 4, department_id: 1 },
        { id: 3, name: 'Digital Logic', credits: 3, department_id: 2 },
      ],
      rowCount: 15,
      orderIndex: 3,
    },
  });

  console.log('Created dataset tables');

  // Create Badges
  const badges = [
    { name: 'First Query', slug: 'first-query', description: 'Execute your first SQL query', category: 'milestone', requirement: { type: 'queries', count: 1 } },
    { name: 'SELECT Master', slug: 'select-master', description: 'Complete all SELECT exercises', category: 'learning', requirement: { type: 'exercises', count: 5 } },
    { name: 'Query Explorer', slug: 'query-explorer', description: 'Run 50 queries', category: 'milestone', requirement: { type: 'queries', count: 50 } },
    { name: 'Week Warrior', slug: 'week-warrior', description: 'Maintain a 7-day streak', category: 'streak', requirement: { type: 'streak', days: 7 } },
    { name: 'SQL Rookie', slug: 'sql-rookie', description: 'Reach Level 2', category: 'level', requirement: { type: 'level', level: 2 } },
  ];

  for (let i = 0; i < badges.length; i++) {
    await prisma.badge.upsert({
      where: { slug: badges[i].slug },
      update: {},
      create: {
        ...badges[i],
        xpReward: 10,
        orderIndex: i + 1,
      },
    });
  }

  console.log('Created badges');

  // Create a sample challenge
  await prisma.challenge.upsert({
    where: { slug: 'top-students' },
    update: {},
    create: {
      title: 'Top Students by CGPA',
      slug: 'top-students',
      description: 'Find the top 5 students with the highest CGPA',
      datasetId: collegeDataset.id,
      difficulty: 'easy',
      xpReward: 25,
      hints: [
        'You need to sort students by CGPA',
        'Look at the ORDER BY clause',
        'Use DESC for descending order and LIMIT for top N',
      ],
      solution: 'SELECT * FROM students ORDER BY cgpa DESC LIMIT 5;',
      explanation: 'ORDER BY sorts the results, DESC puts highest first, and LIMIT restricts the number of rows returned.',
      isDaily: false,
    },
  });

  console.log('Created challenges');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\();
  });
