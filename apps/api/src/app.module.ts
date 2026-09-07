import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { ProgressModule } from './modules/progress/progress.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { SqlModule } from './modules/sql/sql.module';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { ChallengesModule } from './modules/challenges/challenges.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute default
      },
    ]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    ExercisesModule,
    ProgressModule,
    GamificationModule,
    SqlModule,
    DatasetsModule,
    ChallengesModule,
  ],
})
export class AppModule {}
