import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';

jest.mock('./comments.repository', () => ({
  CommentsRepository: class CommentsRepository {
    readonly __mock = true;
  },
}));

describe('CommentsService', () => {
  let service: CommentsService;

  const createCommentDto = {
    message: 'Great post!',
    userId: 1,
    postId: 1,
  };

  const updateCommentDto = {
    message: 'Updated message',
  };

  const commentsRepositoryMock = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useValue: commentsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a comment using user and post connect relations', async () => {
    const createdComment = {
      id: 1,
      ...createCommentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    commentsRepositoryMock.create.mockResolvedValue(createdComment);

    await expect(service.create(createCommentDto)).resolves.toEqual(
      createdComment,
    );

    expect(commentsRepositoryMock.create).toHaveBeenCalledWith({
      message: createCommentDto.message,
      user: {
        connect: {
          id: createCommentDto.userId,
        },
      },
      post: {
        connect: {
          id: createCommentDto.postId,
        },
      },
    });
  });

  it('should throw NotFoundException when creating comment for missing user', async () => {
    commentsRepositoryMock.create.mockRejectedValue({
      code: 'P2025',
      message: 'No User record was found for a nested connect on relation',
    });

    await expect(service.create(createCommentDto)).rejects.toThrow(
      'User not found',
    );
  });

  it('should throw NotFoundException when creating comment for missing post', async () => {
    commentsRepositoryMock.create.mockRejectedValue({
      code: 'P2025',
      message: 'No Post record was found for a nested connect on relation',
    });

    await expect(service.create(createCommentDto)).rejects.toThrow(
      'Post not found',
    );
  });

  it('should update a comment', async () => {
    const updatedComment = {
      id: 1,
      userId: 1,
      postId: 1,
      message: updateCommentDto.message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    commentsRepositoryMock.update.mockResolvedValue(updatedComment);

    await expect(service.update(1, updateCommentDto)).resolves.toEqual(
      updatedComment,
    );

    expect(commentsRepositoryMock.update).toHaveBeenCalledWith(
      1,
      updateCommentDto,
    );
  });

  it('should throw NotFoundException when updating missing comment', async () => {
    commentsRepositoryMock.update.mockRejectedValue({ code: 'P2025' });

    await expect(service.update(1, updateCommentDto)).rejects.toThrow(
      'Comment not found',
    );
  });

  it('should remove a comment', async () => {
    commentsRepositoryMock.remove.mockResolvedValue({});

    await expect(service.remove(1)).resolves.toBeUndefined();

    expect(commentsRepositoryMock.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when removing missing comment', async () => {
    commentsRepositoryMock.remove.mockRejectedValue({ code: 'P2025' });

    await expect(service.remove(1)).rejects.toThrow('Comment not found');
  });
});
