import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service', () => ({
  UsersService: class UsersService {
    readonly __mock = true;
  },
}));

describe('UsersController', () => {
  let controller: UsersController;

  const createUserDto = {
    username: 'john',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password@123',
    biography: 'User biography',
  };

  const updateUserDto = {
    username: 'johnny',
    name: 'Johnny Doe',
    email: 'johnny@example.com',
    password: 'Password@123',
    biography: 'Updated biography',
  };

  const usersServiceMock = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAllUserPosts: jest.fn(),
    getAllUserComments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user and return formatted response', async () => {
    const createdUser = { id: 1, ...createUserDto };

    usersServiceMock.create.mockResolvedValue(createdUser);

    await expect(controller.create(createUserDto)).resolves.toEqual({
      message: 'User created successfully',
      data: createdUser,
    });

    expect(usersServiceMock.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should find a user by id and return formatted response', async () => {
    const user = { id: 1, ...createUserDto, createdAt: new Date() };

    usersServiceMock.findById.mockResolvedValue(user);

    await expect(controller.findById(1)).resolves.toEqual({
      message: 'User found successfully',
      data: user,
    });

    expect(usersServiceMock.findById).toHaveBeenCalledWith(1);
  });

  it('should update a user and return formatted response', async () => {
    const updatedUser = { id: 1, ...updateUserDto };

    usersServiceMock.update.mockResolvedValue(updatedUser);

    await expect(controller.update(1, updateUserDto)).resolves.toEqual({
      message: 'User updated sucessfully',
      data: updatedUser,
    });

    expect(usersServiceMock.update).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should remove a user and return no content', async () => {
    usersServiceMock.remove.mockResolvedValue(undefined);

    await expect(controller.remove(1)).resolves.toBeUndefined();

    expect(usersServiceMock.remove).toHaveBeenCalledWith(1);
  });

  it('should return all posts for a user', async () => {
    const posts = [{ id: 1, title: 'Post 1' }];

    usersServiceMock.getAllUserPosts.mockResolvedValue(posts);

    await expect(controller.findAllPosts(1)).resolves.toEqual({
      message: 'All user posts found successfully',
      data: posts,
    });

    expect(usersServiceMock.getAllUserPosts).toHaveBeenCalledWith(1);
  });

  it('should return all comments for a user', async () => {
    const comments = [{ id: 1, content: 'Comment 1' }];

    usersServiceMock.getAllUserComments.mockResolvedValue(comments);

    await expect(controller.findAllComments(1)).resolves.toEqual({
      message: 'All user comments found successfully',
      data: comments,
    });

    expect(usersServiceMock.getAllUserComments).toHaveBeenCalledWith(1);
  });
});
