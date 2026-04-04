import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user who owns the post',
  })
  @IsNotEmpty({ message: 'The userId cannot be empty' })
  @IsInt({ message: 'The userId must be an integer number' })
  @Min(1, { message: 'The userId must be greater than or equal to 1' })
  userId: number;

  @ApiProperty({
    example: 'The song Bilu Bilu is very good.',
    description: 'Post text with 3-500 characters',
  })
  @IsString({ message: 'The text must be a string' })
  @IsNotEmpty({ message: 'The text cannot be empty' })
  @MinLength(2, { message: 'The text must be at least 2 characters' })
  @MaxLength(500, { message: 'The text must be at most 500 characters' })
  text: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Archive status of the post. Defaults to false when omitted',
  })
  @IsOptional()
  @IsBoolean({ message: 'The archived field must be a boolean' })
  archived?: boolean;
}
