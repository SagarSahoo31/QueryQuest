import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DatasetsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dataset.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { tables: true } },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.dataset.findUnique({
      where: { id },
      include: {
        tables: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.dataset.findUnique({
      where: { slug },
      include: {
        tables: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }
}
