import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateServiceDTO {
  @IsString()
  @ApiProperty({
    example: 'Название услуги',
    description: 'Название услуги',
    required: true,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Описание услуги',
    description: 'Описание услуги',
    required: false,
  })
  description: string | null;

  @IsNumber()
  @ApiProperty({ example: 1500, description: 'Цена услуги', required: true })
  price: number;
  @IsNumber()
  @ApiProperty({ example: 1500, description: 'Время услуги', required: true })
  duration: number;

  @IsString()
  @ApiProperty({
    example: 'uuid-создателя',
    description: 'ID создателя услуги',
    required: true,
  })
  creatorId: string;
}

export class UpdateServiceDTO extends CreateServiceDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'uuid-услуги',
    description: 'ID услуги',
    required: false,
  })
  id: string;
}
