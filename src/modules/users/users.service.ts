import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    username: true,
    name: true,
    email: true,
    biography: true,
    createdAt: true,
  } satisfies Prisma.UserSelect;

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
        select: this.userSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;

          const field =
            target?.[0] ??
            (error.message.includes('username') ? 'username' : null) ??
            (error.message.includes('email') ? 'email' : null);

          const messages: Record<string, string> = {
            email: 'Email already registered',
            username: 'Username already registered',
          };

          throw new ConflictException(
            (field && messages[field]) ?? 'Duplicate field',
          );
        }
      }
      throw error;
    }
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: this.userSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }

        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;

          const field =
            target?.[0] ??
            (error.message.includes('username') ? 'username' : null) ??
            (error.message.includes('email') ? 'email' : null);

          const messages: Record<string, string> = {
            email: 'Email already registered',
            username: 'Username already registered',
          };

          throw new ConflictException(
            (field && messages[field]) ?? 'Duplicate field',
          );
        }
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw error;
    }
  }

  async getAllUserPosts(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        posts: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.posts;
  }

  async getAllUserComments(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        comments: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.comments;
  }
}
