import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';

jest.mock('./posts.repository', () => ({
  PostsRepository: class PostsRepository {
    readonly __mock = true;
  },
}));

describe('PostsService', () => {
  let service: PostsService;

  const createPostDto = {
    userId: 1,
    text: 'The show was full and the crowd was incredible.',
    archived: false,
  };

  const updatePostDto = {
    text: 'Updated post text.',
    archived: true,
  };

  const postsRepositoryMock = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    archive: jest.fn(),
    getAllComments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: postsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post using user connect relation', async () => {
    const createdPost = {
      id: 1,
      userId: 1,
      text: createPostDto.text,
      archived: false,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsRepositoryMock.create.mockResolvedValue(createdPost);

    await expect(service.create(createPostDto)).resolves.toEqual(createdPost);

    expect(postsRepositoryMock.create).toHaveBeenCalledWith({
      text: createPostDto.text,
      archived: createPostDto.archived,
      user: {
        connect: {
          id: createPostDto.userId,
        },
      },
    });
  });

  it('should find a post by id', async () => {
    const post = {
      id: 1,
      userId: 1,
      text: createPostDto.text,
      archived: false,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsRepositoryMock.findById.mockResolvedValue(post);

    await expect(service.findById(1)).resolves.toEqual(post);
    expect(postsRepositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when post is not found', async () => {
    postsRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toThrow('Post not found');
  });

  it('should update a post', async () => {
    const updatedPost = {
      id: 1,
      userId: 1,
      text: updatePostDto.text,
      archived: true,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsRepositoryMock.update.mockResolvedValue(updatedPost);

    await expect(service.update(1, updatePostDto)).resolves.toEqual(
      updatedPost,
    );
    expect(postsRepositoryMock.update).toHaveBeenCalledWith(1, updatePostDto);
  });

  it('should throw NotFoundException when updating missing post', async () => {
    postsRepositoryMock.update.mockRejectedValue({ code: 'P2025' });

    await expect(service.update(1, updatePostDto)).rejects.toThrow(
      'Post not found',
    );
  });

  it('should remove a post', async () => {
    postsRepositoryMock.remove.mockResolvedValue({});

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(postsRepositoryMock.remove).toHaveBeenCalledWith(1);
  });

  it('should archive a post successfully', async () => {
    const archivedPost = {
      id: 1,
      userId: 1,
      text: createPostDto.text,
      archived: true,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    postsRepositoryMock.archive.mockResolvedValue({ count: 1 });
    postsRepositoryMock.findById.mockResolvedValue(archivedPost);

    await expect(service.archivePost(1)).resolves.toEqual(archivedPost);
    expect(postsRepositoryMock.archive).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when archiving missing post', async () => {
    postsRepositoryMock.archive.mockResolvedValue({ count: 0 });
    postsRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.archivePost(1)).rejects.toThrow('Post not found');
  });

  it('should throw ConflictException when post is already archived', async () => {
    postsRepositoryMock.archive.mockResolvedValue({ count: 0 });
    postsRepositoryMock.findById.mockResolvedValue({
      id: 1,
      archived: true,
    });

    await expect(service.archivePost(1)).rejects.toThrow(
      'Post already archived',
    );
  });

  it('should return all post comments', async () => {
    const comments = [{ id: 1, message: 'Great post!' }];

    postsRepositoryMock.getAllComments.mockResolvedValue({ comments });

    await expect(service.getAllPostComments(1)).resolves.toEqual(comments);
  });

  it('should throw NotFoundException when loading comments from missing post', async () => {
    postsRepositoryMock.getAllComments.mockResolvedValue(null);

    await expect(service.getAllPostComments(1)).rejects.toThrow(
      'Post not found',
    );
  });
});
