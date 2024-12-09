import { Body, Controller } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserDTO } from '../user';
import { CreateClientDTO, GetClientDTO, GetClientOrderDTO } from './dto';
import { ClientService } from './client.service';

@ApiTags("client")
@Controller("client")
export class ClientController {
  private readonly _clientService: ClientService;

  @ApiTags('/list')
  @ApiOperation({ summary: 'Получение списка клиентов' })
  @ApiBody({ type: GetUserDTO })
  async getUser(@Body() getUserDTO: GetClientDTO) {
    return await this._clientService.getClients(getUserDTO);
  }

  @ApiTags('/create')
  @ApiOperation({ summary: 'Создание клиента' })
  @ApiBody({ type: CreateClientDTO })
  async createClient(@Body() createClientDTO: CreateClientDTO) {
    return await this._clientService.createClient(createClientDTO);
  }

  @ApiTags('/update')
  @ApiOperation({ summary: 'Обновление клиента' })
  @ApiBody({ type: CreateClientDTO })
  async updateClient(@Body() updateClientDTO: CreateClientDTO) {
    return await this._clientService.updateClient(updateClientDTO);
  }

  @ApiTags('/create-order')
  @ApiOperation({ summary: 'Создание заказа' })
  @ApiBody({ type: CreateClientDTO })
  async createOrderClient(@Body() createClientOrder: CreateClientDTO) {
    return await this._clientService.createOrderClient(createClientOrder);
  }

  @ApiTags('/update-order')
  @ApiOperation({ summary: 'Обновление заказа' })
  @ApiBody({ type: CreateClientDTO })
  async updateOrderClient(@Body() updateClientOrder: CreateClientDTO) {
    return await this._clientService.updateOrderClient(updateClientOrder);
  }

  @ApiTags('/get-orders-client')
  @ApiOperation({ summary: 'Получение заказов клиента' })
  @ApiBody({ type: GetClientOrderDTO })
  async getOrdersClients(@Body() getClientOrderDTO: GetClientOrderDTO) {
    return await this._clientService.getOrdersClients(getClientOrderDTO);
  }
}
