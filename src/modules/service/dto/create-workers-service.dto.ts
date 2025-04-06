import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateWorkerOnServiceDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'd8dcc0d7-7f84-4f51-90db-65d4c71f5464' })
  serviceId: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({ example: ['1fa65697-37ce-4d7d-819e-f81ffe44e044', '2fa65697-37ce-4d7d-819e-f81ffe44e044'] })
  userIds: string[];

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '3fa65697-37ce-4d7d-819e-f81ffe44e044' })
  creatorId: string;
}

export class UpdateWorkerOnServiceDTO extends CreateWorkerOnServiceDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'd8dcc0d7-7f84-4f51-90db-65d4c71f5464' })
  serviceId: string;
}

export class ServiceIdDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'd8dcc0d7-7f84-4f51-90db-65d4c71f5464' })
  serviceId: string;
}