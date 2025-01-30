import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderClientDTO, GetClientDTO, UpdateOrderDTO } from './dto';
import { CreateClientDTO, UpdateClientDTO } from './dto/create-client.dto';
import { ClientService } from './client.service';
import { GetMeaningDTO } from '../dto';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly _clientService: ClientService) {}

  @ApiTags('/list')
  @ApiOperation({ summary: 'Получение списка клиентов' })
  @ApiBody({ type: GetMeaningDTO })
  async getUser(@Body() getUserDTO: GetClientDTO) {
    return await this._clientService.getClients(getUserDTO);
  }

  @Post('list')
  @ApiOperation({ summary: 'Поиск клиентов с фильтрами' })
  @ApiResponse({ status: 200, description: 'Клиенты успешно найдены' })
  @ApiResponse({ status: 404, description: 'Клиенты не найдены' })
  async clientsList(@Body() getClientDTO: GetClientDTO) {
    return await this._clientService.getClients(getClientDTO);
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

  //Запросы на обновление идут ниже

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

  @ApiTags('/create-order')
  @ApiOperation({ summary: 'Создание заказа' })
  @ApiBody({ type: CreateClientDTO })
  async createOrderClient(@Body() createClientOrder: CreateOrderClientDTO) {
    return await this._clientService.createOrder(createClientOrder);
  }

  @ApiTags('/update-order')
  @ApiOperation({ summary: 'Обновление заказа' })
  @ApiBody({ type: CreateClientDTO })
  async updateOrderClient(@Body() updateClientOrder: UpdateOrderDTO) {
    return await this._clientService.updateOrder(updateClientOrder);
  }

  // @ApiTags('/get-orders-client')
  // @ApiOperation({ summary: 'Получение заказов клиента' })
  // @ApiBody({ type: GetClientOrderDTO })
  // async getOrdersClients(@Body() getClientOrderDTO: GetClientOrderDTO) {
  //   return await this._clientService.getOrdersClients(getClientOrderDTO);
  // }
}
