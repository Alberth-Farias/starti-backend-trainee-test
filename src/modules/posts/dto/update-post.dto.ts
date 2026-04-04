import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'The show was full and the crowd was incredible.',
    description: 'Post text with 2-500 characters',
  })
  @IsOptional()
  @IsString({ message: 'The text must be a string' })
  @IsNotEmpty({ message: 'The text cannot be empty' })
  @MinLength(2, { message: 'The text must be at least 2 characters' })
  @MaxLength(500, { message: 'The text must be at most 500 characters' })
  text?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Archive status of the post',
  })
  @IsOptional()
  @IsBoolean({ message: 'The archived field must be a boolean' })
  archived?: boolean;
}
