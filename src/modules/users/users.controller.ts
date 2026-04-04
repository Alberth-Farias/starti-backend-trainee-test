import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: data,
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.findById(id);
    return {
      message: 'User found successfully',
      data: data,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.usersService.update(id, updateUserDto);
    return {
      message: 'User updated sucessfully',
      data: data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
  }

  @Get(':id/posts')
  async findAllPosts(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.getAllUserPosts(id);
    return {
      message: 'All user posts found successfully',
      data: data,
    };
  }

  @Get(':id/comments')
  async findAllComments(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.getAllUserComments(id);
    return {
      message: 'All user comments found successfully',
      data: data,
    };
  }
}
