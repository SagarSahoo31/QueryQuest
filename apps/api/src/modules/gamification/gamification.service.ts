import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

const LEVEL_TITLES: Record<number, string> = {
  1: 'SQL Rookie',
  2: 'Query Learner',
  3: 'Query Explorer',
  4: 'Data Detective',
  5: 'SQL Developer',
  6: 'Join Master',
  7: 'Query Architect',
  8: 'SQL Engineer',
  9: 'Database Ninja',
  10: 'SQL Legend',
};

const XP_PER_LEVEL = 500;

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    });

    const badges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    const currentLevel = stats?.currentLevel ?? 1;
    const totalXp = stats?.totalXp ?? 0;
    const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
    const xpToNextLevel = XP_PER_LEVEL - xpInCurrentLevel;

    return {
      level: {
        current: currentLevel,
        title: LEVEL_TITLES[Math.min(currentLevel, 10)] || 'SQL Master',
        xp: totalXp,
        xpToNext: xpToNextLevel,
        progress: Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100),
      },
      streak: {
        current: streak?.currentStreak ?? 0,
        longest: streak?.longestStreak ?? 0,
        lastActivity: streak?.lastActivity,
      },
      badges: {
        earned: badges.length,
        recent: badges.slice(0, 5).map((b) => ({
          id: b.badge.id,
          name: b.badge.name,
          icon: b.badge.icon,
          earnedAt: b.earnedAt,
        })),
      },
    };
  }

  async getBadges(userId: string) {
    const allBadges = await this.prisma.badge.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true, earnedAt: true },
    });

    const earnedMap = new Map(userBadges.map((b) => [b.badgeId, b.earnedAt]));

    return allBadges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      slug: badge.slug,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
      isEarned: earnedMap.has(badge.id),
      earnedAt: earnedMap.get(badge.id) || null,
      progress: 0, // TODO: Calculate progress toward badge
    }));
  }

  async getLeaderboard(type: 'weekly' | 'monthly' | 'all-time', limit: number = 20) {
    const now = new Date();
    let dateFilter: Date | null = null;

    if (type === 'weekly') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (type === 'monthly') {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // For simplicity, we'll use total XP from user_stats
    // In production, you'd track XP earned in time period
    const users = await this.prisma.userStats.findMany({
      where: dateFilter
        ? {
            updatedAt: { gte: dateFilter },
          }
        : undefined,
      orderBy: { totalXp: 'desc' },
      take: limit,
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    return users.map((stat, index) => ({
      rank: index + 1,
      userId: stat.userId,
      displayName: stat.user.profile?.displayName || 'Anonymous',
      xp: stat.totalXp,
      level: stat.currentLevel,
    }));
  }

  async updateStreak(userId: string) {
    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    });

    if (!streak) {
      return this.prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivity: new Date(),
        },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = streak.lastActivity ? new Date(streak.lastActivity) : null;
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        // Same day, no change
        return streak;
      } else if (diffDays === 1) {
        // Next day, extend streak
        return this.prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: { increment: 1 },
            longestStreak: Math.max(streak.currentStreak + 1, streak.longestStreak),
            lastActivity: today,
          },
        });
      } else {
        // Missed days, reset streak
        return this.prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: 1,
            lastActivity: today,
          },
        });
      }
    }

    return this.prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(1, streak.longestStreak),
        lastActivity: today,
      },
    });
  }

  async checkAndAwardBadges(userId: string) {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) return [];

    const newBadges: string[] = [];

    // Check various badge conditions
    const badges = await this.prisma.badge.findMany();

    for (const badge of badges) {
      // Skip if already earned
      const existing = await this.prisma.userBadge.findUnique({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
      });

      if (existing) continue;

      let earned = false;

      // Check badge requirements based on category
      const requirement = badge.requirement as any;

      switch (badge.category) {
        case 'milestone':
          if (requirement.type === 'queries' && stats.queriesRun >= requirement.count) {
            earned = true;
          }
          if (requirement.type === 'exercises' && stats.exercisesDone >= requirement.count) {
            earned = true;
          }
          break;

        case 'streak':
          const streak = await this.prisma.streak.findUnique({ where: { userId } });
          if (streak && streak.currentStreak >= requirement.days) {
            earned = true;
          }
          break;

        case 'level':
          if (stats.currentLevel >= requirement.level) {
            earned = true;
          }
          break;
      }

      if (earned) {
        await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
        newBadges.push(badge.name);

        // Award XP for badge
        if (badge.xpReward > 0) {
          await this.prisma.userStats.update({
            where: { userId },
            data: { totalXp: { increment: badge.xpReward } },
          });
        }
      }
    }

    return newBadges;
  }
}
