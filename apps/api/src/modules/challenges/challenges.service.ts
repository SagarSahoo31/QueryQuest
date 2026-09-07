import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async findAll(difficulty?: string) {
    return this.prisma.challenge.findMany({
      where: {
        isDaily: false,
        ...(difficulty && { difficulty }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        dataset: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async getDaily() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.challenge.findFirst({
      where: {
        isDaily: true,
        availableFrom: { lte: today },
        availableUntil: { gte: today },
      },
      include: {
        dataset: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        dataset: {
          select: { id: true, name: true, tables: true },
        },
      },
    });

    if (!challenge) {
      return null;
    }

    let attempt = null;
    if (userId) {
      attempt = await this.prisma.challengeAttempt.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } },
      });
    }

    // Don't expose solution
    const { solution, explanation, ...challengeData } = challenge;

    return {
      ...challengeData,
      attempt: attempt
        ? {
            attempted: true,
            isCompleted: attempt.isCompleted,
            hintsUsed: attempt.hintsUsed,
          }
        : { attempted: false },
    };
  }

  async submitSolution(challengeId: string, userId: string, query: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return null;
    }

    // Check if already completed
    const existingAttempt = await this.prisma.challengeAttempt.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    });

    if (existingAttempt?.isCompleted) {
      return {
        isCorrect: true,
        alreadyCompleted: true,
        xpEarned: 0,
      };
    }

    // For now, we'll execute the query and check if it returns results
    // In production, you'd compare against expected results
    try {
      // Execute the query (this would go through SqlService)
      // For simplicity, we'll assume it's correct if it doesn't error
      const isCorrect = true; // TODO: Actually validate

      const attempt = await this.prisma.challengeAttempt.upsert({
        where: { userId_challengeId: { userId, challengeId } },
        update: {
          query,
          isCompleted: isCorrect,
          xpEarned: isCorrect ? challenge.xpReward : 0,
        },
        create: {
          userId,
          challengeId,
          query,
          isCompleted: isCorrect,
          xpEarned: isCorrect ? challenge.xpReward : 0,
        },
      });

      if (isCorrect) {
        await this.prisma.userStats.update({
          where: { userId },
          data: {
            totalXp: { increment: challenge.xpReward },
            challengesDone: { increment: 1 },
          },
        });
      }

      return {
        isCorrect,
        xpEarned: attempt.xpEarned,
        explanation: isCorrect ? challenge.explanation : null,
      };
    } catch (error) {
      return {
        isCorrect: false,
        error: error.message,
        xpEarned: 0,
      };
    }
  }

  async getHint(challengeId: string, currentLevel: number) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge || !challenge.hints) {
      return null;
    }

    const hints = challenge.hints as string[];
    if (currentLevel >= hints.length) {
      return null;
    }

    return {
      hint: hints[currentLevel],
      hintLevel: currentLevel + 1,
      hintsRemaining: hints.length - currentLevel - 1,
    };
  }
}
