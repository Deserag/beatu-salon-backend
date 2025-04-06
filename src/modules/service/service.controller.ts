import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import {
  CreateServiceDTO,
  CreateProductDTO,
  UpdateServiceDTO,
  UpdateProductDTO,
} from './dto';
import { GetMeaningDTO } from '../dto';
import { CreateWorkerOnServiceDTO, UpdateWorkerOnServiceDTO, ServiceIdDTO } from './dto/create-workers-service.dto';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly _serviceService: ServiceService) {}

  @Get('worker-on-service/:serviceId/:userId')
  @ApiOperation({ summary: 'Получение связи услуги и мастера по ID' })
  @ApiResponse({ status: 200, description: 'Связь успешно получена' })
  async getWorkerOnServiceByIds(@Param('serviceId') serviceId: string, @Param('userId') userId: string) {
    return this._serviceService.getWorkerOnServiceByIds(serviceId, userId);
  }
  @Get('service/:id')
  @ApiOperation({ summary: 'Получение информации об услуге' })
  @ApiResponse({ status: 200, description: 'Услуга успешно получена' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена' })
  async getServiceInfo(@Param('id') id: string) {
    return this._serviceService.GetServiceForId(id);
  }

  @Post('services-list')
  @ApiOperation({ summary: 'Получение списка услуг' })
  @ApiResponse({ status: 200, description: 'Услуги успешно получены' })
  @ApiResponse({ status: 404, description: 'Услуги не найдены' })
  async getServicesList(@Body() getServiceDTO: GetMeaningDTO) {
    return this._serviceService.GetServicesList(getServiceDTO);
  }
  // @Post('worker-on-service/list/:serviceId')
  // @ApiOperation({ summary: 'Получение мастеров по услуге' })
  // @ApiResponse({ status: 200, description: 'Мастера успешно получены' })
  // async getWorkerOnService(@Body() getServiceDTO: GetMeaningDTO){
  //   return this._serviceService.getWorkerOnServiceByIds(getServiceDTO);
  // }

  @Post('worker-on-service/list')
  @ApiOperation({ summary: 'Получение всех связей Услуг и Мастеров' })
  @ApiResponse({ status: 200, description: 'Связи успешно получены' })
  async getAllWorkerOnService(@Body() getServiceDTO: GetMeaningDTO) {
    return this._serviceService.getAllWorkerOnService(getServiceDTO);
  }


  @Post('products-list')
  @ApiOperation({ summary: 'Получение списка товаров' })
  @ApiResponse({ status: 200, description: 'Товары успешно получены' })
  @ApiResponse({ status: 404, description: 'Товары не найдены' })
  async getProductsList(@Body() getProductDTO: GetMeaningDTO) {
    return this._serviceService.GetProductsList(getProductDTO);
  }

  @Post('create-service')
  @ApiOperation({ summary: 'Создание услуги' })
  @ApiResponse({ status: 201, description: 'Услуга успешно создана' })
  @ApiResponse({ status: 400, description: 'Недостаточно данных для создания услуги' })
  async createService(@Body() createServiceDTO: CreateServiceDTO) {
    return this._serviceService.CreateService(createServiceDTO);
  }

  @Post('worker-on-service')
  @ApiOperation({ summary: 'Создание связи услуги и мастеров' })
  @ApiResponse({ status: 201, description: 'Связь успешно создана' })
  async createWorkerOnService(@Body() dto: CreateWorkerOnServiceDTO) {
    return this._serviceService.createWorkerOnService(dto);
  }

  @Post('create-product')
  @ApiOperation({ summary: 'Создание товара' })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  @ApiResponse({ status: 400, description: 'Недостаточно данных для создания товара' })
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this._serviceService.CreateProduct(createProductDTO);
  }

  @Put('update-service')
  @ApiOperation({ summary: 'Обновление информации об услуге' })
  @ApiResponse({ status: 200, description: 'Услуга успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена' })
  async updateService(@Body() updateServiceDTO: UpdateServiceDTO) {
    return this._serviceService.UpdateService(updateServiceDTO);
  }

  @Put('update-product')
  @ApiOperation({ summary: 'Обновление информации о товаре' })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async updateProduct(@Body() updateProductDTO: UpdateProductDTO) {
    return this._serviceService.UpdateProduct(updateProductDTO);
  }



  @Put('worker-on-service')
  @ApiOperation({ summary: 'Обновление связи услуги и мастера' })
  @ApiResponse({ status: 200, description: 'Связь успешно обновлена' })
  async updateWorkerOnService(@Body() dto: UpdateWorkerOnServiceDTO) {
    return this._serviceService.updateWorkerOnService(dto);
  }



  @Delete('delete-service/:id')
  @ApiOperation({ summary: 'Удаление услуги' })
  @ApiResponse({ status: 200, description: 'Услуга успешно удалена' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена' })
  async deleteService(@Param('id') id: string) {
    return this._serviceService.DeleteService(id);
  }

  @Delete('delete-product/:id')
  @ApiOperation({ summary: 'Удаление товара' })
  @ApiResponse({ status: 200, description: 'Товар успешно удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async deleteProduct(@Param('id') id: string) {
    return this._serviceService.DeleteProduct(id);
  }

  @Delete('worker-on-service/:serviceId/:userId')
  @ApiOperation({ summary: 'Удаление связи услуги и мастера' })
  @ApiResponse({ status: 200, description: 'Связь успешно удалена' })
  async deleteWorkerOnService(@Param('serviceId') serviceId: string, @Param('userId') userId: string) {
    return this._serviceService.deleteWorkerOnService(serviceId, userId);
  }

}