import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { CreateServiceDTO, GetServiceDTO } from './dto';
import { ServiceService } from './service.service';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly _serviceService: ServiceService) {}
  @Post('list')
  @ApiOperation({ summary: 'Поиск услуг с фильтрами' })
  @ApiResponse({ status: 200, description: 'Услуги успешно найдены' })
  @ApiResponse({ status: 404, description: 'Услуги не найдены' })
  async serviceList(@Body() getServiceDTO: GetServiceDTO) {
    return await this._serviceService.GetService(getServiceDTO);
  }

  //Запросы на создание

  @Post('create-service')
  @ApiOperation({ summary: 'Создание услуги' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания пользователя',
  })
  async createService(@Body() createServiceDTO: CreateServiceDTO) {
    return await this._serviceService.CreateService(createServiceDTO);
  }
}
