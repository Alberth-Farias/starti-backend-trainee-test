import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from './comments.repository';

type PrismaKnownRequestErrorLike = {
  code: string;
  meta?: {
    target?: unknown;
    cause?: unknown;
  };
  message?: string;
};

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

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

  private getRecordNotFoundMessage(
    error: PrismaKnownRequestErrorLike,
    fallbackMessage: string,
  ) {
    const cause =
      typeof error.meta?.cause === 'string'
        ? error.meta.cause.toLowerCase()
        : '';
    const message = error.message?.toLowerCase() ?? '';

    const errorSource = `${cause} ${message}`;

    if (errorSource.includes('user')) {
      return 'User not found';
    }

    if (errorSource.includes('post')) {
      return 'Post not found';
    }

    if (errorSource.includes('comment')) {
      return 'Comment not found';
    }

    return fallbackMessage;
  }

  async create(createCommentDto: CreateCommentDto) {
    const { userId, postId, ...commentData } = createCommentDto;

    try {
      return await this.commentsRepository.create({
        ...commentData,
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      });
    } catch (error) {
      if (this.isPrismaKnownRequestError(error)) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            this.getRecordNotFoundMessage(error, 'User or post not found'),
          );
        }
      }

      throw error;
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      return await this.commentsRepository.update(id, updateCommentDto);
    } catch (error) {
      if (this.isPrismaKnownRequestError(error)) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Comment not found');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.commentsRepository.remove(id);
    } catch (error) {
      if (this.isPrismaKnownRequestError(error)) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Comment not found');
        }
      }

      throw error;
    }
  }
}
