import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDTO } from '../user';
import {
  CreateClientDTO,
  CreateOrderClientDTO,
  GetClientDTO,
  GetClientOrderDTO,
  UpdateClientDTO,
} from './dto';
import { ClientService } from './client.service';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly _clientService: ClientService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получение информации о клиенте' })
  @ApiResponse({ status: 200, description: 'Клиент успешно получен' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  async getClientInfo(@Param('id') id: string) {
    return await this._clientService.getClientById(id);
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
}
