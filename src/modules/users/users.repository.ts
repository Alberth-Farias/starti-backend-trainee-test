import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput, select: Prisma.UserSelect) {
    return this.prisma.user.create({
      data,
      select,
    });
  }

  async findById(id: number, select: Prisma.UserSelect) {
    return this.prisma.user.findUnique({
      where: { id },
      select,
    });
  }

  async update(
    id: number,
    data: Prisma.UserUpdateInput,
    select: Prisma.UserSelect,
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllPosts(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        posts: true,
      },
    });
  }

  async getAllComments(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        comments: true,
      },
    });
  }
}
