import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
  },
}));

jest.mock('./users.repository', () => ({
  UsersRepository: class UsersRepository {
    readonly __mock = true;
  },
}));

describe('UsersService', () => {
  let service: UsersService;
  const now = new Date('2026-04-04T00:00:00.000Z');

  const createUserDto = {
    username: 'john',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password@123',
    biography: 'Bio',
  };

  const updateUserDto = {
    username: 'johnny',
    name: 'Johnny Doe',
    email: 'johnny@example.com',
    password: 'Password@123',
    biography: 'Updated bio',
  };

  const publicSelect = {
    id: true,
    username: true,
    name: true,
    email: true,
    biography: true,
    createdAt: true,
  };

  const usersRepositoryMock = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAllPosts: jest.fn(),
    getAllComments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and select public fields', async () => {
    const createdUser = {
      id: 1,
      ...createUserDto,
      createdAt: now,
    };

    usersRepositoryMock.create.mockResolvedValue(createdUser);

    await expect(service.create(createUserDto)).resolves.toEqual(createdUser);

    expect(usersRepositoryMock.create).toHaveBeenCalledWith(
      { ...createUserDto, password: 'hashed-password' },
      publicSelect,
    );
  });

  it('should throw ConflictException when username is duplicated on create', async () => {
    const error = {
      code: 'P2002',
      meta: { target: ['username'] },
      message: 'Unique constraint failed on the fields: (`username`)',
    };

    usersRepositoryMock.create.mockRejectedValue(error);

    await expect(
      service.create({
        username: 'john',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password@123',
        biography: 'Bio',
      }),
    ).rejects.toThrow('Username already registered');
  });

  it('should find a user by id', async () => {
    const user = {
      id: 1,
      ...createUserDto,
      createdAt: now,
    };

    usersRepositoryMock.findById.mockResolvedValue(user);

    await expect(service.findById(1)).resolves.toEqual(user);

    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(1, publicSelect);
  });

  it('should throw NotFoundException when user is not found', async () => {
    usersRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toThrow('User not found');
  });

  it('should update a user and select public fields', async () => {
    const updatedUser = {
      id: 1,
      ...updateUserDto,
      createdAt: now,
    };

    usersRepositoryMock.update.mockResolvedValue(updatedUser);

    await expect(service.update(1, updateUserDto)).resolves.toEqual(
      updatedUser,
    );

    expect(usersRepositoryMock.update).toHaveBeenCalledWith(
      1,
      updateUserDto,
      publicSelect,
    );
  });

  it('should throw NotFoundException when updating a missing user', async () => {
    usersRepositoryMock.update.mockRejectedValue({ code: 'P2025' });

    await expect(
      service.update(1, {
        ...updateUserDto,
      }),
    ).rejects.toThrow('User not found');
  });

  it('should remove a user', async () => {
    usersRepositoryMock.remove.mockResolvedValue({});

    await expect(service.remove(1)).resolves.toBeUndefined();

    expect(usersRepositoryMock.remove).toHaveBeenCalledWith(1);
  });

  it('should get all posts for a user', async () => {
    const posts = [{ id: 1, title: 'Post 1' }];

    usersRepositoryMock.getAllPosts.mockResolvedValue({ posts });

    await expect(service.getAllUserPosts(1)).resolves.toEqual(posts);
  });

  it('should get all comments for a user', async () => {
    const comments = [{ id: 1, content: 'Comment 1' }];

    usersRepositoryMock.getAllComments.mockResolvedValue({ comments });

    await expect(service.getAllUserComments(1)).resolves.toEqual(comments);
  });
});
