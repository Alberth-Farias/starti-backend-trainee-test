import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  async findById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async archive(id: number) {
    return this.prisma.post.updateMany({
      where: {
        id,
        archived: false,
      },
      data: {
        archived: true,
      },
    });
  }

  async getAllComments(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      select: {
        comments: true,
      },
    });
  }
}
