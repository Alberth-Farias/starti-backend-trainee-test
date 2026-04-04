import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcryptjs';

type PrismaKnownRequestErrorLike = {
  code: string;
  meta?: {
    target?: unknown;
  };
  message?: string;
};

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
  };

  private isPrismaKnownRequestError(
    error: unknown,
  ): error is PrismaKnownRequestErrorLike {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    if (
      !('code' in error) ||
      typeof (error as { code?: unknown }).code !== 'string'
    ) {
      return false;
    }

    return (
      !('message' in error) ||
      typeof (error as { message?: unknown }).message === 'string'
    );
  }

  private getDuplicateFieldMessage(error: PrismaKnownRequestErrorLike) {
    const target = error.meta?.target as string[] | undefined;

    const field =
      target?.[0] ??
      (error.message?.includes('username') ? 'username' : null) ??
      (error.message?.includes('email') ? 'email' : null);

    const messages: Record<string, string> = {
      email: 'Email already registered',
      username: 'Username already registered',
    };

    return (field && messages[field]) ?? 'Duplicate field';
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    try {
      return await this.prisma.user.create({
        data: { ...createUserDto, password: hashedPassword },
        select: this.userSelect,
      });
    } catch (error) {
      if (this.isPrismaKnownRequestError(error)) {
        if (error.code === 'P2002') {
          throw new ConflictException(this.getDuplicateFieldMessage(error));
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
      if (this.isPrismaKnownRequestError(error)) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }

        if (error.code === 'P2002') {
          throw new ConflictException(this.getDuplicateFieldMessage(error));
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
      if (this.isPrismaKnownRequestError(error)) {
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
