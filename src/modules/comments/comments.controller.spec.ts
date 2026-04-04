import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

jest.mock('./comments.service', () => ({
  CommentsService: class CommentsService {
    readonly __mock = true;
  },
}));

describe('CommentsController', () => {
  let controller: CommentsController;

  const createCommentDto = {
    message: 'Great post!',
    userId: 1,
    postId: 1,
  };

  const updateCommentDto = {
    message: 'Updated message',
  };

  const commentsServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: commentsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a comment and return formatted response', async () => {
    const createdComment = {
      id: 1,
      ...createCommentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    commentsServiceMock.create.mockResolvedValue(createdComment);

    await expect(controller.create(createCommentDto)).resolves.toEqual({
      message: 'Comment created successfully',
      data: createdComment,
    });

    expect(commentsServiceMock.create).toHaveBeenCalledWith(createCommentDto);
  });

  it('should update a comment and return formatted response', async () => {
    const updatedComment = {
      id: 1,
      userId: 1,
      postId: 1,
      message: updateCommentDto.message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    commentsServiceMock.update.mockResolvedValue(updatedComment);

    await expect(controller.update(1, updateCommentDto)).resolves.toEqual({
      message: 'Comment updated successfully',
      data: updatedComment,
    });

    expect(commentsServiceMock.update).toHaveBeenCalledWith(
      1,
      updateCommentDto,
    );
  });

  it('should remove a comment and return no content', async () => {
    commentsServiceMock.remove.mockResolvedValue(undefined);

    await expect(controller.remove(1)).resolves.toBeUndefined();

    expect(commentsServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
