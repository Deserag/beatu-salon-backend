import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

export enum EStatusRecord {
  CANCELED = 'CANCELED',
  DONE = 'DONE',
  PROBLEMS = 'PROBLEMS',
}
export class CreateRecordDTO {
  @IsUUID()
  @ApiProperty({ example: 'uuid-service-id' })
  serviceId: string;

  @IsUUID()
  @ApiProperty({ example: 'uuid-master-id' })
  masterId: string;

  @IsUUID()
  @ApiProperty({ example: 'uuid-client-id' })
  clientId: string;

  @IsUUID()
  @ApiProperty({ example: 'uuid-office-id' })
  officeId: string;

  @IsUUID()
  @ApiProperty({ example: 'uuid-cabinet-id' })
  cabinetId: string;

  @IsDateString()
  @ApiProperty({ example: '2025-06-09T09:00:00.000Z' })
  dateTime: string;
}

export class UpdateRecordDTO extends CreateRecordDTO {
  @IsUUID()
  @ApiProperty({ example: 'uuid-record-id' })
  id: string;
}

export class ChangeRecordStatusDTO {
  @IsUUID()
  @ApiProperty({ example: 'uuid-record-id' })
  id: string;

  @IsEnum(EStatusRecord)
  @ApiProperty({ example: 'DONE', enum: EStatusRecord })
  status: EStatusRecord;
}

export class GetRecordListDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '', required: true })
  userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '', required: true })
  workerId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '', required: true })
  serviceId: string;

  @IsOptional()
  @ApiProperty({ example: 1 })
  page: number;

  @IsOptional()
  @ApiProperty({ example: 10 })
  size: number;
}
