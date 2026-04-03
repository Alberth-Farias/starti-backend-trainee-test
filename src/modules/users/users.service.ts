import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          biography: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;

          const field =
            target?.[0] ??
            (error.message.includes('username') ? 'username' : null) ??
            (error.message.includes('email') ? 'email' : null);

          const messages: Record<string, string> = {
            email: 'Email already registered',
            username: 'Username already registered',
          };

          throw new ConflictException(
            (field && messages[field]) ?? 'Duplicate field',
          );
        }
      }
      throw error;
    }
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        biography: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not Found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    //validate

    //verify if have

    //changue and/or return message
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    //validate

    //verify if have

    //delete and/or return message

    return `This action removes a #${id} user`;
  }

  getAllUserPosts(id: number) {
    // validate
    //return response
  }

  getAllUserComments(id: number) {}
}
