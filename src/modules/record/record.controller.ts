import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecordService } from './record.service';
import {
  CreateRecordDTO,
  UpdateRecordDTO,
  ChangeRecordStatusDTO,
  GetRecordListDTO,
} from './dto';

@ApiTags('record')
@Controller('record')
export class RecordController {
  constructor(private readonly _recordService: RecordService) {}

  @Get('masters-by-service')
  @ApiOperation({ summary: 'Получение мастеров по id услуги' })
  @ApiResponse({ status: 200, description: 'Список мастеров получен' })
  async getMastersByService(@Query('serviceId') serviceId: string) {
    return this._recordService.GetMastersByService(serviceId);
  }

  @Post('list')
  @ApiOperation({ summary: 'Получение списка записей' })
  @ApiResponse({ status: 200, description: 'Список записей получен' })
  async getRecordList(@Body() dto: GetRecordListDTO) {
    return this._recordService.GetRecordList(dto);
  }

  @Post('by-id')
  @ApiOperation({ summary: 'Получение записи по ID' })
  @ApiResponse({ status: 200, description: 'Запись найдена' })
  async getRecordById(@Body() body: { id: string }) {
    return this._recordService.GetRecordById(body.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Создание новой записи' })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  async createRecord(@Body() dto: CreateRecordDTO) {
    return this._recordService.CreateRecord(dto);
  }

  @Put('update')
  @ApiOperation({ summary: 'Обновление записи' })
  @ApiResponse({ status: 200, description: 'Запись обновлена' })
  async updateRecord(@Body() dto: UpdateRecordDTO) {
    return this._recordService.UpdateRecord(dto);
  }

  @Put('status')
  @ApiOperation({ summary: 'Смена статуса записи' })
  @ApiResponse({ status: 200, description: 'Статус изменён' })
  async changeStatus(@Body() dto: ChangeRecordStatusDTO) {
    return this._recordService.ChangeRecordStatus(dto);
  }
}
