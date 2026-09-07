import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getOverallProgress(userId: string) {
    // Get all published lessons
    const allLessons = await this.prisma.lesson.findMany({
      where: { isLocked: false },
      select: { id: true, moduleId: true },
    });

    // Get completed lessons
    const completedLessons = await this.prisma.lessonProgress.findMany({
      where: {
        userId,
        status: 'completed',
      },
      include: {
        lesson: {
          include: {
            module: {
              include: { course: true },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    // Get current lesson (first in-progress or last completed)
    const inProgress = await this.prisma.lessonProgress.findFirst({
      where: {
        userId,
        status: 'in_progress',
      },
      include: { lesson: true },
      orderBy: { startedAt: 'desc' },
    });

    const currentLesson = inProgress?.lesson ?? completedLessons[0]?.lesson;

    // Get current course
    let currentCourse = null;
    if (currentLesson) {
      const module = await this.prisma.module.findUnique({
        where: { id: currentLesson.moduleId },
        include: { course: true },
      });
      currentCourse = module?.course;
    }

    // Get recent activity (last 5 completed lessons)
    const recentActivity = completedLessons.slice(0, 5).map((p) => ({
      lessonId: p.lessonId,
      title: p.lesson.title,
      completedAt: p.completedAt,
      xpEarned: p.xpEarned,
    }));

    return {
      totalLessons: allLessons.length,
      completedLessons: completedLessons.length,
      percentageComplete:
        allLessons.length > 0
          ? Math.round((completedLessons.length / allLessons.length) * 100)
          : 0,
      currentCourse: currentCourse
        ? {
            id: currentCourse.id,
            title: currentCourse.title,
            progress: 0, // Will be calculated separately if needed
          }
        : null,
      currentLesson: currentLesson
        ? {
            id: currentLesson.id,
            title: currentLesson.title,
            moduleId: currentLesson.moduleId,
          }
        : null,
      recentActivity,
    };
  }

  async getCourseProgress(courseId: string, userId: string) {
    const modules = await this.prisma.module.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    const modulesWithProgress = modules.map((module) => {
      const lessonsWithProgress = module.lessons.map((lesson) => {
        const progress = lesson.progress[0];
        return {
          id: lesson.id,
          title: lesson.title,
          status: progress?.status ?? 'not_started',
          xpEarned: progress?.xpEarned ?? 0,
        };
      });

      const completedCount = lessonsWithProgress.filter(
        (l) => l.status === 'completed'
      ).length;

      return {
        id: module.id,
        title: module.title,
        progress: lessonsWithProgress.length > 0
          ? Math.round((completedCount / lessonsWithProgress.length) * 100)
          : 0,
        lessons: lessonsWithProgress,
      };
    });

    return {
      courseId,
      modules: modulesWithProgress,
    };
  }

  async getTopicMastery(userId: string) {
    // Get all exercise attempts with their topics (via lesson -> module)
    const attempts = await this.prisma.exerciseAttempt.findMany({
      where: { userId },
      include: {
        exercise: {
          include: {
            lesson: {
              include: { module: true },
            },
          },
        },
      },
    });

    // Group by module (topic)
    const topicStats: Record<string, { completed: number; total: number }> = {};

    // Count exercises per topic
    const exercisesPerTopic = await this.prisma.exercise.groupBy({
      by: ['lessonId'],
      _count: { id: true },
    });

    // Map lessons to modules
    const lessons = await this.prisma.lesson.findMany({
      include: { module: true },
    });

    const lessonToModule: Record<string, string> = {};
    lessons.forEach((l) => {
      lessonToModule[l.id] = l.module.title;
    });

    // Initialize topics
    const uniqueTopics = [...new Set(lessons.map((l) => l.module.title))];
    uniqueTopics.forEach((topic) => {
      topicStats[topic] = { completed: 0, total: 0 };
    });

    // Count totals
    exercisesPerTopic.forEach((e) => {
      const topic = lessonToModule[e.lessonId];
      if (topic && topicStats[topic]) {
        topicStats[topic].total += e._count.id;
      }
    });

    // Count completed (correct attempts)
    attempts.forEach((a) => {
      if (a.isCorrect) {
        const topic = a.exercise.lesson.module.title;
        if (topic && topicStats[topic]) {
          topicStats[topic].completed += 1;
        }
      }
    });

    return Object.entries(topicStats).map(([name, stats]) => ({
      name,
      mastery: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      exercisesCompleted: stats.completed,
      exercisesTotal: stats.total,
    }));
  }
}
