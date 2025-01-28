import { Body, Controller } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserDTO } from '../user';
import { CreateClientDTO, GetClientDTO, GetClientOrderDTO } from './dto';
import { ClientService } from './client.service';

@ApiTags('client')
@Controller('client')
export class ClientController {
constructor (private readonly _clientService: ClientService) {}
}
