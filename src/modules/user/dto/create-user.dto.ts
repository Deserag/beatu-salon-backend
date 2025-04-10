import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsUUID,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Иванов', required: true })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Иван', required: true })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Иванович', required: false })
  middleName: string;

  @IsDateString()
  @ApiProperty({
    example: '2000-01-01',
    required: false,
    description: 'Дата рождения в формате YYYY-MM-DD',
  })
  birthDate: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({ example: ['f053ca2c-35e9-44f3-8955-183082948707'], required: true })
  departments: string[];

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z]).*$/, {
    message: 'Пароль должен содержать как минимум одну букву и одну цифру',
  })
  @ApiProperty({
    example: 'employee123',
    required: true,
    description: 'Пароль от 6 символов, должен содержать буквы и цифры',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Логин должен быть не менее 6 символов' })
  @ApiProperty({ example: 'employee123', required: true })
  login: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: 'uuid-роль', required: false })
  roleId?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'employee@example.com', required: true })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '987654321',
    required: false,
    description: 'Telegram ID пользователя',
  })
  telegramId: string;

}

export class UpdateUserDTO extends CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'айди', required: true })
  id: string
}