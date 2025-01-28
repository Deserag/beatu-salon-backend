import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateClientDTO {
  @IsString()
  @ApiProperty({ example: '123456789', description: 'Telegram ID клиента', required: true })
  telegramId: string;

  @IsString()
  @ApiProperty({ example: 'Иван', description: 'Имя клиента', required: true })
  firstName: string;

  @IsString()
  @ApiProperty({ example: 'Иванов', description: 'Фамилия клиента', required: true })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Иванович', description: 'Отчество клиента', required: false })
  middleName?: string;

  @IsDate()
  @ApiProperty({ example: '1990-01-01', description: 'Дата рождения клиента', required: true })
  birthDate: Date;
}

export class UpdateClientDTO extends CreateClientDTO {
  @IsString()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID клиента', required: true })
  id: string;
}