import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const courses = await this.prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                slug: true,
                isLocked: true,
                xpReward: true,
              },
            },
          },
        },
      },
    });

    return courses;
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });
  }

  async getCourseProgress(courseId: string, userId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        module: { courseId },
      },
      select: { id: true },
    });

    const lessonIds = lessons.map((l) => l.id);

    const completedCount = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: lessonIds },
        status: 'completed',
      },
    });

    return {
      total: lessons.length,
      completed: completedCount,
      percentage: lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0,
    };
  }
}
