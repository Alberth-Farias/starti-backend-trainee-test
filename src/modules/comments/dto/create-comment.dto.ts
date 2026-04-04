import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user who authored the comment',
  })
  @IsNotEmpty({ message: 'The userId cannot be empty' })
  @IsInt({ message: 'The userId must be an integer number' })
  @Min(1, { message: 'The userId must be greater than or equal to 1' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the post that will receive the comment',
  })
  @IsNotEmpty({ message: 'The postId cannot be empty' })
  @IsInt({ message: 'The postId must be an integer number' })
  @Min(1, { message: 'The postId must be greater than or equal to 1' })
  postId: number;

  @ApiProperty({
    example: 'Amazing performance! The audience loved it.',
    description: 'Comment message with 2-300 characters',
  })
  @IsString({ message: 'The message must be a string' })
  @IsNotEmpty({ message: 'The message cannot be empty' })
  @MinLength(2, { message: 'The message must be at least 2 characters' })
  @MaxLength(300, { message: 'The message must be at most 300 characters' })
  message: string;
}
