import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        module: true,
        exercises: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            type: true,
            title: true,
            difficulty: true,
            xpReward: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    let progress = null;
    if (userId) {
      progress = await this.prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: id } },
      });
    }

    return { ...lesson, progress };
  }

  async findBySlug(slug: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { slug },
      include: {
        module: true,
        exercises: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    let progress = null;
    if (userId) {
      progress = await this.prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
      });
    }

    return { ...lesson, progress };
  }

  async startLesson(lessonId: string, userId: string) {
    const existing = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (existing) {
      if (existing.status === 'not_started') {
        return this.prisma.lessonProgress.update({
          where: { id: existing.id },
          data: {
            status: 'in_progress',
            startedAt: new Date(),
          },
        });
      }
      return existing;
    }

    return this.prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
        status: 'in_progress',
        startedAt: new Date(),
      },
    });
  }

  async completeLesson(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Update or create progress
    const progress = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: 'completed',
        completedAt: new Date(),
        xpEarned: lesson.xpReward,
      },
      create: {
        userId,
        lessonId,
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        xpEarned: lesson.xpReward,
      },
    });

    // Update user stats
    await this.prisma.userStats.update({
      where: { userId },
      data: {
        totalXp: { increment: lesson.xpReward },
        lessonsCompleted: { increment: 1 },
      },
    });

    // Get next lesson
    const nextLesson = await this.getNextLesson(lessonId);

    return {
      progress,
      xpEarned: lesson.xpReward,
      nextLesson,
    };
  }

  private async getNextLesson(currentLessonId: string) {
    const currentLesson = await this.prisma.lesson.findUnique({
      where: { id: currentLessonId },
      include: { module: true },
    });

    if (!currentLesson) return null;

    // Try next lesson in same module
    const nextInModule = await this.prisma.lesson.findFirst({
      where: {
        moduleId: currentLesson.moduleId,
        orderIndex: { gt: currentLesson.orderIndex },
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (nextInModule) return nextInModule;

    // Try first lesson in next module
    const nextModule = await this.prisma.module.findFirst({
      where: {
        courseId: currentLesson.module.courseId,
        orderIndex: { gt: currentLesson.module.orderIndex },
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (!nextModule) return null;

    return this.prisma.lesson.findFirst({
      where: { moduleId: nextModule.id },
      orderBy: { orderIndex: 'asc' },
    });
  }
}
