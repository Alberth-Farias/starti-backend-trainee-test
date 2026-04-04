import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

jest.mock('./posts.service', () => ({
  PostsService: class PostsService {
    readonly __mock = true;
  },
}));

describe('PostsController', () => {
  let controller: PostsController;

  const createPostDto = {
    userId: 1,
    text: 'The show was full and the crowd was incredible.',
    archived: false,
  };

  const updatePostDto = {
    text: 'Updated post text.',
    archived: true,
  };

  const postsServiceMock = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    archivePost: jest.fn(),
    getAllPostComments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: postsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post and return formatted response', async () => {
    const createdPost = {
      id: 1,
      userId: 1,
      text: createPostDto.text,
      archived: false,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsServiceMock.create.mockResolvedValue(createdPost);

    await expect(controller.create(createPostDto)).resolves.toEqual({
      message: 'Post created successfully',
      data: createdPost,
    });

    expect(postsServiceMock.create).toHaveBeenCalledWith(createPostDto);
  });

  it('should find a post by id and return formatted response', async () => {
    const post = {
      id: 1,
      userId: 1,
      text: createPostDto.text,
      archived: false,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsServiceMock.findById.mockResolvedValue(post);

    await expect(controller.findById(1)).resolves.toEqual({
      message: 'Post found successfully',
      data: post,
    });

    expect(postsServiceMock.findById).toHaveBeenCalledWith(1);
  });

  it('should update a post and return formatted response', async () => {
    const updatedPost = {
      id: 1,
      userId: 1,
      text: updatePostDto.text,
      archived: true,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsServiceMock.update.mockResolvedValue(updatedPost);

    await expect(controller.update(1, updatePostDto)).resolves.toEqual({
      message: 'Post updated successfully',
      data: updatedPost,
    });

    expect(postsServiceMock.update).toHaveBeenCalledWith(1, updatePostDto);
  });

  it('should remove a post and return no content', async () => {
    postsServiceMock.remove.mockResolvedValue(undefined);

    await expect(controller.remove(1)).resolves.toBeUndefined();

    expect(postsServiceMock.remove).toHaveBeenCalledWith(1);
  });

  it('should archive a post and return formatted response', async () => {
    const archivedPost = {
      id: 1,
      userId: 1,
      text: createPostDto.text,
      archived: true,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsServiceMock.archivePost.mockResolvedValue(archivedPost);

    await expect(controller.archive(1)).resolves.toEqual({
      message: 'Post archived successfully',
      data: archivedPost,
    });

    expect(postsServiceMock.archivePost).toHaveBeenCalledWith(1);
  });

  it('should return all comments from a post', async () => {
    const comments = [{ id: 1, message: 'Great post!' }];

    postsServiceMock.getAllPostComments.mockResolvedValue(comments);

    await expect(controller.findAllComments(1)).resolves.toEqual({
      message: 'All post comments found successfully',
      data: comments,
    });

    expect(postsServiceMock.getAllPostComments).toHaveBeenCalledWith(1);
  });
});
