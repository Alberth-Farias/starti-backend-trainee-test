import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../../prisma/prisma.service';

jest.mock('../../../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {
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

  const prismaServiceMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
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

    prismaServiceMock.user.create.mockResolvedValue(createdUser);

    await expect(service.create(createUserDto)).resolves.toEqual(createdUser);

    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: createUserDto,
      select: publicSelect,
    });
  });

  it('should throw ConflictException when username is duplicated on create', async () => {
    const error = {
      code: 'P2002',
      meta: { target: ['username'] },
      message: 'Unique constraint failed on the fields: (`username`)',
    };

    prismaServiceMock.user.create.mockRejectedValue(error);

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

    prismaServiceMock.user.findUnique.mockResolvedValue(user);

    await expect(service.findById(1)).resolves.toEqual(user);

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: publicSelect,
    });
  });

  it('should throw NotFoundException when user is not found', async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toThrow('User not found');
  });

  it('should update a user and select public fields', async () => {
    const updatedUser = {
      id: 1,
      ...updateUserDto,
      createdAt: now,
    };

    prismaServiceMock.user.update.mockResolvedValue(updatedUser);

    await expect(service.update(1, updateUserDto)).resolves.toEqual(
      updatedUser,
    );

    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateUserDto,
      select: publicSelect,
    });
  });

  it('should throw NotFoundException when updating a missing user', async () => {
    prismaServiceMock.user.update.mockRejectedValue({ code: 'P2025' });

    await expect(
      service.update(1, {
        ...updateUserDto,
      }),
    ).rejects.toThrow('User not found');
  });

  it('should remove a user', async () => {
    prismaServiceMock.user.delete.mockResolvedValue({});

    await expect(service.remove(1)).resolves.toBeUndefined();

    expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should get all posts for a user', async () => {
    const posts = [{ id: 1, title: 'Post 1' }];

    prismaServiceMock.user.findUnique.mockResolvedValue({ posts });

    await expect(service.getAllUserPosts(1)).resolves.toEqual(posts);
  });

  it('should get all comments for a user', async () => {
    const comments = [{ id: 1, content: 'Comment 1' }];

    prismaServiceMock.user.findUnique.mockResolvedValue({ comments });

    await expect(service.getAllUserComments(1)).resolves.toEqual(comments);
  });
});
