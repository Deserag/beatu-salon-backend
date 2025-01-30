import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString } from 'class-validator';
// // {
//   "clientId": "5f613a27-5a87-43a9-bfe9-4d36f2a3c006",
//   "workerId": "acd22bbd-0efa-420b-8a37-ae383cc1f5f7",
//   "dateTime": "2024-07-20T10:00:00.000Z",
//   "serviceId": "uuid-услуги",
//   "officeId": "uuid-офиса",
//   "workCabinetId": "uuid-кабинета",
//   "result": "Успешно выполнено"
// // }
export class CreateOrderClientDTO {
  @IsString()
  @ApiProperty({
    example: 'uuid-клиента', 
    description: 'ID клиента',
    required: true,
  })
  clientId: string;

  @IsString()
  @ApiProperty({
    example: 'uuid-сотрудника', 
    description: 'ID сотрудника',
    required: true,
  })
  workerId: string;

  @IsDateString() 
  @ApiProperty({
    example: '2024-07-20T10:00:00.000Z', 
    description: 'Дата и время записи',
    required: true,
  })
  dateTime: string;



  @IsString()
  @ApiProperty({
    example: 'uuid-услуги', 
    description: 'ID услуги',
    required: true,
  })
  serviceId: string;

  @IsString()
  @ApiProperty({
    example: 'uuid-офиса', 
    description: 'ID офиса',
    required: true,
  })
  officeId: string;

  @IsString()
  @ApiProperty({
    example: 'uuid-кабинета', 
    description: 'ID кабинета',
    required: true,
  })
  workCabinetId: string;

  @IsString()
  @ApiProperty({
    example: 'Успешно выполнено',
    description: 'Результат оказания услуги (опционально)',
    required: false, 
  })
  result: string;
}

export class UpdateOrderDTO extends CreateOrderClientDTO {
  @IsString()
  @ApiProperty({
    example: 'uuid-клиента', 
    description: 'ID клиента',
    required: true,
  })
  orderId: string;
}