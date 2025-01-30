import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1fa65697-37ce-4d7d-819e-f81ffe44e044',
    required: true,
  })
  creatorId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Гель Лунный Свет', required: true })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Гель для ногтей с переливающимся эффектом, 30 мл',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 500, description: 'Объем', required: false })
  volume: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'шт',
    description: 'Единица измерения',
    required: true,
  })
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 50,
    description: 'Количество товара',
    required: true,
  })
  quantity: number;

  @IsNotEmpty()
  @ApiProperty({ example: '750', required: false })
  prices: number;
}

export class CreateProductForSaleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'officeId1', required: true })
  officeId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'productId1', required: true })
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 10, required: true })
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'clientId1', required: true })
  clientId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 750, required: true })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1fa65697-37ce-4d7d-819e-f81ffe44e044',
    required: true,
  })
  creatorId: string;
}

export class UpdateProductDTO extends CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'productId1', required: true })
  productId: string;
}

export class UpdateProductForSaleDTO extends CreateProductForSaleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'saleId1', required: true })
  saleId: string;
}
