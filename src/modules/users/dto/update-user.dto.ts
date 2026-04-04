import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'ReginaldoRossi',
    description: 'Username with 3-20 characters (letters only, no spaces)',
  })
  @IsString({ message: 'The username must be a string' })
  @IsNotEmpty({ message: 'The username cannot be empty' })
  @MinLength(3, { message: 'The username must be at least 3 characters' })
  @MaxLength(20, { message: 'The username must be at most 20 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ]+$/, {
    message: 'The username must only contain letters and no spaces',
  })
  username: string;

  @ApiProperty({
    example: 'Reginaldo Rossi',
    description: 'Name with 3-30 characters',
  })
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  @MinLength(3, { message: 'The name must be at least 3 characters' })
  @MaxLength(30, { message: 'The name must be at most 30 characters' })
  name: string;

  @ApiProperty({
    example: 'reginaldorossi@gmail.com',
    description: 'Valid email',
  })
  @IsNotEmpty({ message: 'The email cannot be empty' })
  @IsEmail({}, { message: 'The email must be a valid email' })
  @MaxLength(254, { message: 'The email must be at most 254 characters' })
  email: string;

  @ApiProperty({
    example: 'Reginaldo@123',
    description:
      'Strong password with 8-16 characters containing at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  @IsString({ message: 'The password must be a string' })
  @IsNotEmpty({ message: 'The password cannot be empty' })
  @MinLength(8, { message: 'The password must be at least 8 characters' })
  @MaxLength(16, { message: 'The password must be at most 16 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    example: 'Most famous singer in the world',
    description: 'Biography with 3-90 characters',
  })
  @IsString({ message: 'The biography must be a string' })
  @IsNotEmpty({ message: 'The biography cannot be empty' })
  @MinLength(3, { message: 'The biography must be at least 3 characters' })
  @MaxLength(90, { message: 'The biography must be at most 90 characters' })
  biography: string;
}
