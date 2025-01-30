import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import {
  CreateServiceDTO,
  CreateProductDTO,
  CreateProductForSaleDTO,
  UpdateServiceDTO,
  UpdateProductDTO,
} from './dto';
import { GetMeaningDTO } from '../dto';
import { UpdateServiceUserList } from './dto/update-service-user-list.dto';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly _serviceService: ServiceService) {}
  @Get('service/:id')
  @ApiOperation({ summary: 'Получение информации об услуге' })
  @ApiResponse({ status: 200, description: 'Услуга успешно получена' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена' })
  async getServiceInfo(@Param('id') id: string) {
    return await this._serviceService.GetServiceForId(id);
  }

  @Get('product/:id')
  @ApiOperation({ summary: 'Получение информации о товаре' })
  @ApiResponse({ status: 200, description: 'Товар успешно получен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async getProductInfo(@Param('id') id: string) {
    return await this._serviceService.GetProductForId(id);
  }

  @Post('services-list')
  @ApiOperation({ summary: 'Получение списка услуг' })
  @ApiResponse({ status: 200, description: 'Услуги успешно получены' })
  @ApiResponse({ status: 404, description: 'Услуги не найдены' })
  async getServicesList(@Body() getServiceDTO: GetMeaningDTO) {
    return await this._serviceService.GetServicesList(getServiceDTO);
  }

  @Post('products-list')
  @ApiOperation({ summary: 'Получение списка товаров' })
  @ApiResponse({ status: 200, description: 'Товары успешно получены' })
  @ApiResponse({ status: 404, description: 'Товары не найдены' })
  async getProductsList(@Body() getProductDTO: GetMeaningDTO) {
    return await this._serviceService.GetProductsList(getProductDTO);
  }

  //Запросы на создание

  @Post('create-service')
  @ApiOperation({ summary: 'Создание услуги' })
  @ApiResponse({ status: 201, description: 'Услуга успешно создана' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания услуги',
  })
  async createService(@Body() createServiceDTO: CreateServiceDTO) {
    return await this._serviceService.CreateService(createServiceDTO);
  }

  @Post('create-product')
  @ApiOperation({ summary: 'Создание товара' })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания товара',
  })
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    return await this._serviceService.CreateProduct(createProductDTO);
  }



  //d8dcc0d7-7f84-4f51-90db-65d4c71f5464 услуга
  //1fa65697-37ce-4d7d-819e-f81ffe44e044
  //

  // @Post('create-product-sale')
  // @ApiOperation({ summary: 'Создание продажи товара' })
  // @ApiResponse({ status: 201, description: 'Продажа успешно создана' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Недостаточно данных для создания продажи',
  // })
  // async createProductForSale(
  //   @Body() createProductForSaleDTO: CreateProductForSaleDTO,
  // ) {
  //   return await this._serviceService.CreateProfuctForSale(
  //     createProductForSaleDTO,
  //   );
  // }

  @Put('update-service')
  @ApiOperation({ summary: 'Обновление информации об услуге' })
  @ApiResponse({ status: 200, description: 'Услуга успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена' })
  async updateService(@Body() updateServiceDTO: UpdateServiceDTO) {
    return await this._serviceService.UpdateService(updateServiceDTO);
  }
  @Put('update-product')
  @ApiOperation({ summary: 'Обновление информации о товаре' })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async updateProduct(@Body() updateProductDTO: UpdateProductDTO) {
    return await this._serviceService.UpdateProduct(updateProductDTO);
  }
  // @Put('update-product-sale')
  // @ApiOperation({ summary: 'Обновление продажи товара' })
  // @ApiResponse({ status: 200, description: 'Продажа успешно обновлена' })
  // @ApiResponse({ status: 404, description: 'Продажа не найдена' })
  // async updateProductForSale(
  //   @Body() updateProductForSaleDTO: UpdateProductForSaleDTO,
  // ) {
  //   return await this._serviceService.UpdateProductForSale(
  //     updateProductForSaleDTO,
  //   );
  // }

  //Удаление необходимых товаров
  @Delete('delete-service/:id')
  @ApiOperation({ summary: 'Удаление услуги' })
  @ApiResponse({ status: 200, description: 'Услуга успешно удалена' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена' })
  async deleteService(@Param('id') id: string) {
    return await this._serviceService.DeleteService(id);
  }

  @Delete('delete-product/:id')
  @ApiOperation({ summary: 'Удаление товара' })
  @ApiResponse({ status: 200, description: 'Товар успешно удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async deleteProduct(@Param('id') id: string) {
    return await this._serviceService.DeleteProduct(id);
  }

  // @Delete('delete-product-sale/:id')
  // @ApiOperation({ summary: 'Удаление продажи товара' })
  // @ApiResponse({ status: 200, description: 'Продажа успешно удалена' })
  // @ApiResponse({ status: 404, description: 'Продажа не найдена' })
  // async deleteProductForSale(@Param('id') id: string) {
  //   return await this._serviceService.DeleteProductForSale(id);
  // }
}
