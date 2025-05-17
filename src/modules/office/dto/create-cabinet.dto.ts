import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateCabinetDTO {
  @IsString()
  @ApiProperty({ example: 'A101', description: 'Номер кабинета', required: true })
  number: string;

  @IsUUID()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID офиса', required: true })
  officeId: string;

  @IsUUID()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID создателя', required: true })
  creatorId: string;
}

export class UpdateCabinetDTO extends CreateCabinetDTO {
  @IsUUID()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID кабинета', required: true })
  id: string;
}

export class DeleteCabinetDTO {
  cabinetId: string;
  adminId: string;
}