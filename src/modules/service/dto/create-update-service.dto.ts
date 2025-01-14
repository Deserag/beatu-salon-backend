import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ид создателя', required: true })
  creatorId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Название услуги', required: true })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Описание услуги', required: false })
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1000,
    description: 'Цена услуги в рублях',
    required: true,
  })
  price: number;
}

export class UpdateServiceDTO extends CreateServiceDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ид', required: true })
  id: string;
}
