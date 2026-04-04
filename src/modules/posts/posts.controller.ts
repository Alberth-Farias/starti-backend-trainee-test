import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiCreatedResponse({ description: 'Post created successfully' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async create(@Body() createPostDto: CreatePostDto) {
    const data = await this.postsService.create(createPostDto);
    return {
      message: 'Post created successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a post by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Post id' })
  @ApiOkResponse({ description: 'Post found successfully' })
  @ApiBadRequestResponse({ description: 'Invalid post id' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.postsService.findById(id);
    return {
      message: 'Post found successfully',
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Post id' })
  @ApiOkResponse({ description: 'Post updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation error or invalid post id' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const data = await this.postsService.update(id, updatePostDto);
    return {
      message: 'Post updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a post by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Post id' })
  @ApiNoContentResponse({ description: 'Post removed successfully' })
  @ApiBadRequestResponse({ description: 'Invalid post id' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.postsService.remove(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a post by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Post id' })
  @ApiOkResponse({ description: 'Post archived successfully' })
  @ApiBadRequestResponse({ description: 'Invalid post id' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiConflictResponse({ description: 'Post already archived' })
  async archive(@Param('id', ParseIntPipe) id: number) {
    const data = await this.postsService.archivePost(id);
    return {
      message: 'Post archived successfully',
      data,
    };
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'List all comments from a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post id' })
  @ApiOkResponse({ description: 'All post comments found successfully' })
  @ApiBadRequestResponse({ description: 'Invalid post id' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async findAllComments(@Param('id', ParseIntPipe) id: number) {
    const data = await this.postsService.getAllPostComments(id);
    return {
      message: 'All post comments found successfully',
      data,
    };
  }
}
