import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Updated comment text after review.',
    description: 'Comment message with 2-300 characters',
  })
  @IsOptional()
  @IsString({ message: 'The message must be a string' })
  @IsNotEmpty({ message: 'The message cannot be empty' })
  @MinLength(2, { message: 'The message must be at least 2 characters' })
  @MaxLength(300, { message: 'The message must be at most 300 characters' })
  message?: string;
}
