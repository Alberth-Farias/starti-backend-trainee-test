import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiCreatedResponse({ description: 'Comment created successfully' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'User or post not found' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    const data = await this.commentsService.create(createCommentDto);
    return {
      message: 'Comment created successfully',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment id' })
  @ApiOkResponse({ description: 'Comment updated successfully' })
  @ApiBadRequestResponse({
    description: 'Validation error or invalid comment id',
  })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const data = await this.commentsService.update(id, updateCommentDto);
    return {
      message: 'Comment updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a comment by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment id' })
  @ApiNoContentResponse({ description: 'Comment removed successfully' })
  @ApiBadRequestResponse({ description: 'Invalid comment id' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.commentsService.remove(id);
  }
}
