import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

type PrismaKnownRequestErrorLike = {
  code: string;
  meta?: {
    target?: unknown;
  };
  message?: string;
};

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

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

  async create(createPostDto: CreatePostDto) {
    const { userId, ...postData } = createPostDto;
    try {
      return await this.postsRepository.create({
        ...postData,
        user: {
          connect: {
            id: userId,
          },
        },
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

  async findById(id: number) {
    const post = await this.postsRepository.findById(id);

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      return await this.postsRepository.update(id, updatePostDto);
    } catch (error) {
      if (this.isPrismaKnownRequestError(error)) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Post not found');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.postsRepository.remove(id);
    } catch (error) {
      if (this.isPrismaKnownRequestError(error)) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Post not found');
        }
      }

      throw error;
    }
  }

  async archivePost(id: number) {
    const archiveResult = await this.postsRepository.archive(id);
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (archiveResult.count === 1) {
      return post;
    }

    throw new ConflictException('Post already archived');
  }

  async getAllPostComments(id: number) {
    const post = await this.postsRepository.getAllComments(id);

    if (!post) throw new NotFoundException('Post not found');

    return post.comments;
  }
}
