import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, userId?: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: { lesson: true },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    let attempt = null;
    if (userId) {
      attempt = await this.prisma.exerciseAttempt.findFirst({
        where: { userId, exerciseId: id },
        orderBy: { attemptedAt: 'desc' },
      });
    }

    // Don't expose solution unless explicitly requested
    const { solution, ...exerciseData } = exercise;

    return {
      ...exerciseData,
      attempt: attempt
        ? {
            attempted: true,
            isCorrect: attempt.isCorrect,
            hintsUsed: attempt.hintsUsed,
          }
        : { attempted: false },
    };
  }

  async submitAnswer(exerciseId: string, userId: string, answer: any) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const isCorrect = this.validateAnswer(exercise, answer);

    const attempt = await this.prisma.exerciseAttempt.create({
      data: {
        userId,
        exerciseId,
        answer,
        isCorrect,
        xpEarned: isCorrect ? exercise.xpReward : 0,
      },
    });

    if (isCorrect) {
      await this.prisma.userStats.update({
        where: { userId },
        data: {
          totalXp: { increment: exercise.xpReward },
          exercisesDone: { increment: 1 },
        },
      });
    }

    return {
      isCorrect,
      xpEarned: attempt.xpEarned,
      attemptId: attempt.id,
      explanation: isCorrect ? exercise.explanation : null,
      hint: !isCorrect ? this.extractHint(exercise, 0) : null,
    };
  }

  async getHint(exerciseId: string, currentLevel: number) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise || !exercise.hints) {
      return null;
    }

    const hints = exercise.hints as string[];
    if (currentLevel >= hints.length) {
      return null;
    }

    return {
      hint: hints[currentLevel],
      hintLevel: currentLevel + 1,
      hintsRemaining: hints.length - currentLevel - 1,
    };
  }

  async getSolution(exerciseId: string, userId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // Record that user viewed solution
    await this.prisma.exerciseAttempt.create({
      data: {
        userId,
        exerciseId,
        isCorrect: false,
        xpEarned: 0,
        hintsUsed: 999, // Indicates solution was viewed
      },
    });

    return {
      solution: exercise.solution,
      explanation: exercise.explanation,
    };
  }

  private validateAnswer(exercise: any, answer: any): boolean {
    const content = exercise.content as any;

    switch (exercise.type) {
      case 'MULTIPLE_CHOICE':
        return content.options.find((o: any) => o.id === answer.optionId)?.isCorrect ?? false;

      case 'FILL_BLANK':
        const blanks = content.blanks as any[];
        return blanks.every((blank: any) => {
          const userAnswer = answer.answers?.[blank.id];
          if (!userAnswer) return false;
          return (
            userAnswer.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim() ||
            blank.acceptableAnswers?.some(
              (a: string) => a.toLowerCase().trim() === userAnswer.toLowerCase().trim()
            )
          );
        });

      case 'QUERY_PREDICTION':
        return answer.optionId === content.correctOptionId;

      case 'QUERY_WRITING':
        // For query writing, we'd need to execute the query and compare results
        // For now, simplified validation
        return false;

      case 'DEBUGGING':
        return answer.query?.trim() === exercise.solution?.trim();

      default:
        return false;
    }
  }

  private extractHint(exercise: any, level: number): string | null {
    const hints = exercise.hints as string[];
    return hints?.[level] ?? null;
  }
}
