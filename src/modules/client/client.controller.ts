import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderClientDTO, GetClientDTO, UpdateOrderDTO } from './dto';
import { CreateClientDTO, UpdateClientDTO } from './dto/create-client.dto';
import { ClientService } from './client.service';
import { GetOrderDTO } from './dto/get-order.dto';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly _clientService: ClientService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получение клиента по ID' })
  @ApiResponse({ status: 200, description: 'Клиент успешно найден' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  async getClientById(@Param('id') clientId: string) {
    return await this._clientService.getClientById(clientId);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Получение заказов клиента по ID' })
  @ApiResponse({ status: 200, description: 'Заказы успешно найдены' })
  @ApiResponse({ status: 404, description: 'Заказы не найдены' })
  async getClientOrders(@Param('id') clientId: string) {
    return await this._clientService.getClientOrders(clientId);
  }

  @Post('list')
  @ApiOperation({ summary: 'Поиск клиентов с фильтрами' })
  @ApiResponse({ status: 200, description: 'Клиенты успешно найдены' })
  @ApiResponse({ status: 404, description: 'Клиенты не найдены' })
  async clientsList(@Body() getClientDTO: GetClientDTO) {
    return await this._clientService.getClients(getClientDTO);
  }

  @Post('orders/list')
  @ApiOperation({ summary: 'Поиск заказов с фильтрами' })
  @ApiResponse({ status: 200, description: 'Заказы успешно найдены' })
  @ApiResponse({ status: 404, description: 'Заказы не найдены' })
  async ordderList(@Body() GetOrderDTO: GetOrderDTO) {
    return await this._clientService.getOrders(GetOrderDTO);
  }


  @Post('create')
  @ApiOperation({ summary: 'Создание клиента' })
  @ApiResponse({ status: 200, description: 'Клиент успешно создан' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания клиента',
  })
  async createClient(@Body() createClientDTO: CreateClientDTO) {
    return await this._clientService.createClient(createClientDTO);
  }

  @Post('create-order')
  @ApiOperation({ summary: 'Создание заказа' })
  @ApiResponse({ status: 200, description: 'Заказ успешно создан' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания заказа',
  })
  async createOrder(@Body() createOrderDTO: CreateOrderClientDTO) {
    return await this._clientService.createOrder(createOrderDTO);
  }

  @Put('update')
  @ApiOperation({ summary: 'Обновление клиента' })
  @ApiResponse({ status: 200, description: 'Клиент успешно обновлен' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для обновления клиента',
  })
  async updateClient(@Body() updateClientDTO: UpdateClientDTO) {
    return await this._clientService.updateClient(updateClientDTO);
  }

  @Put('update-order')
  @ApiOperation({ summary: 'Обновление заказа' })
  @ApiBody({ type: UpdateOrderDTO })
  async updateOrderClient(@Body() updateClientOrder: UpdateOrderDTO) {
    return await this._clientService.updateOrder(updateClientOrder);
  }

  @Delete('order/:orderId')
  @ApiOperation({ summary: 'Мягкое удаление заказа' })
  @ApiResponse({ status: 200, description: 'Заказ успешно мягко удален' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiResponse({ status: 400, description: 'Заказ уже удален' })
  async deleteOrderSoftly(@Param('orderId') orderId: string) {
    return await this._clientService.deleteOrderSoftly(orderId);
  }

  @Delete(':clientId')
  @ApiOperation({ summary: 'Мягкое удаление клиента' })
  @ApiResponse({ status: 200, description: 'Клиент успешно мягко удален' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  @ApiResponse({ status: 400, description: 'Клиент уже удален' })
  async deleteClientSoftly(@Param('clientId') clientId: string) {
    return await this._clientService.deleteClientSoftly(clientId);
  }
}