import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetClientDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '034213',
    description: 'телеграм id',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '1',
    description: 'страницы номер',
  })
  page: number;

  @IsString()
  @ApiProperty({
    example: '10',
    description: 'количество элементов на странице',
  })
  size: number;
}
