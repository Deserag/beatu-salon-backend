import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WorkerInfoDTO {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string | null;
}

export class ServiceWithWorkersDTO {
  id: string;
  name: string;
  workers: WorkerInfoDTO[];
}
