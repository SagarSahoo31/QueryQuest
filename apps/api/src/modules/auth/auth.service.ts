import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface TokenPayload {
  sub: string;
  email?: string;
  isGuest: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user with profile and stats
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        profile: {
          create: {
            displayName: dto.displayName || dto.email.split('@')[0],
          },
        },
        stats: {
          create: {},
        },
        streak: {
          create: {},
        },
      },
      include: {
        profile: true,
        stats: true,
        streak: true,
      },
    });

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email!,
      isGuest: false,
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email!,
      isGuest: false,
    });

    // Update streak if needed
    await this.updateStreakIfNecessary(user.id);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async loginAsGuest() {
    const guestId = uuidv4();
    const guestNumber = Math.floor(Math.random() * 100000);

    const user = await this.prisma.user.create({
      data: {
        isGuest: true,
        profile: {
          create: {
            displayName: `Guest_${guestNumber}`,
          },
        },
        stats: {
          create: {},
        },
        streak: {
          create: {},
        },
      },
      include: {
        profile: true,
        stats: true,
        streak: true,
      },
    });

    const tokens = await this.generateTokens({
      sub: user.id,
      isGuest: true,
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        stats: true,
        streak: true,
      },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async validateGoogleUser(googleId: string, email: string, name: string) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
      include: {
        profile: true,
        stats: true,
        streak: true,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          googleId,
          profile: {
            create: {
              displayName: name,
            },
          },
          stats: {
            create: {},
          },
          streak: {
            create: {},
          },
        },
        include: {
          profile: true,
          stats: true,
          streak: true,
        },
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId },
        include: {
          profile: true,
          stats: true,
          streak: true,
        },
      });
    }

    return user;
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh-secret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          profile: true,
          stats: true,
          streak: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens({
        sub: user.id,
        email: user.email!,
        isGuest: user.isGuest,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh-secret'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private async updateStreakIfNecessary(userId: string) {
    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    });

    if (!streak) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = streak.lastActivity;
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity);
      lastActivityDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        // Continue streak
        await this.prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: { increment: 1 },
            longestStreak: Math.max(streak.currentStreak + 1, streak.longestStreak),
            lastActivity: today,
          },
        });
      } else if (diffDays > 1) {
        // Reset streak
        await this.prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: 1,
            lastActivity: today,
          },
        });
      }
    } else {
      // First activity
      await this.prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          longestStreak: 1,
          lastActivity: today,
        },
      });
    }
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...result } = user;
    return result;
  }
}
