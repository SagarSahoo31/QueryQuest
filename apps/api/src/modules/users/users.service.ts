import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        stats: true,
        streak: true,
      },
    });

    if (!user) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: dto,
    });
  }

  async getStats(userId: string) {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    // Get topic mastery
    const exercises = await this.prisma.exerciseAttempt.findMany({
      where: { userId, isCorrect: true },
      include: {
        exercise: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Group by topic (module title)
    const topicStats: Record<string, { completed: number; total: number }> = {};

    // This is a simplified version - in production, you'd track by topic
    const topicMastery = Object.entries(topicStats).map(([topic, stats]) => ({
      name: topic,
      mastery: Math.round((stats.completed / stats.total) * 100),
      exercisesCompleted: stats.completed,
      exercisesTotal: stats.total,
    }));

    return {
      ...stats,
      topicsMastered: topicMastery,
    };
  }

  async updateStats(userId: string, updates: Partial<{
    totalXp: number;
    queriesRun: number;
    exercisesDone: number;
    challengesDone: number;
    lessonsCompleted: number;
  }>) {
    return this.prisma.userStats.update({
      where: { userId },
      data: updates,
    });
  }

  async incrementXp(userId: string, amount: number) {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) return null;

    const newXp = stats.totalXp + amount;
    const newLevel = this.calculateLevel(newXp);

    return this.prisma.userStats.update({
      where: { userId },
      data: {
        totalXp: newXp,
        currentLevel: newLevel,
      },
    });
  }

  private calculateLevel(xp: number): number {
    // Simple level calculation: every 500 XP = 1 level
    return Math.floor(xp / 500) + 1;
  }
}
