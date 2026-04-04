import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({ data });
  }

  async update(id: number, data: Prisma.CommentUpdateInput) {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
