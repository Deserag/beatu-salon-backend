import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OfficeService } from './office.service';
import { GetOfficeDTO } from './dto/get-office.dto';
import { CreateOfficeDTO, DeleteOfficeDTO, getCabinetDTO, UpdateOfficeDTO } from './dto';
import { CreateCabinetDTO, DeleteCabinetDTO, UpdateCabinetDTO } from './dto/create-cabinet.dto';

@ApiTags('office')
@Controller('office')
export class OfficeController {
  constructor(private readonly _officeService: OfficeService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию об офисе' })
  @ApiResponse({
    status: 200,
    description: 'Информация об офисе получена корректно',
  })
  async getOffice(@Param('id') id: string) {
    return await this._officeService.GetOfiiceInfo(id);
  }

  @Post('list')
  @ApiOperation({ summary: 'Получить офисы' })
  @ApiResponse({ status: 200, description: 'Офисы получены корректно' })
  async getOffices(@Body() getOfficeDTO: GetOfficeDTO) {
    return await this._officeService.GetOffice(getOfficeDTO);
  }
  @Post('list-cabinets')
  @ApiOperation({ summary: 'Получить Кабинеты' })
  @ApiResponse({ status: 200, description: 'Кабинеты получены корректно' })
  async getCabinets(@Body() getCabinetDTO: getCabinetDTO) {
    return await this._officeService.GetCabinet(getCabinetDTO);
  }

  @Post('list/cabinet')
  @ApiOperation({ summary: 'Получить кабинеты' })
  @ApiResponse({ status: 200, description: 'Кабинеты получены корректно' })
  async getCabinetonOffice(@Body() getOfficeDTO: GetOfficeDTO) {
    return await this._officeService.getCabinetonOffice(getOfficeDTO);
  }
  @Post('create-cabinet')
  @ApiOperation({ summary: 'Создать кабинет' })
  @ApiResponse({ status: 200, description: 'Кабинет создан корректно' })
  async createCabinet(@Body() createCabinetDTO: CreateCabinetDTO) {
    return await this._officeService.createCabinet(createCabinetDTO);
  }
  @Post('create-office')
  @ApiOperation({ summary: 'Создать офис' })
  @ApiResponse({ status: 200, description: 'Офис создан корректно' })
  async createOffice(@Body() createOfficeDTO: CreateOfficeDTO) {
    return await this._officeService.createOffice(createOfficeDTO);
  }

  @Put('update-office')
  @ApiOperation({ summary: 'Обновить офис' })
  @ApiResponse({ status: 200, description: 'Офис обновлен корректно' })
  async updateOffice(@Body() UpdateOfficeDTO: UpdateOfficeDTO) {
    return await this._officeService.updateOffice(UpdateOfficeDTO);
  }

  @Put('update-cabinet')
  @ApiOperation({ summary: 'Обновить офис' })
  @ApiResponse({ status: 200, description: 'Офис обновлен корректно' })
  async updateCabinet(@Body() UpdateCabinetDTO: UpdateCabinetDTO) {
    return await this._officeService.updateCabinet(UpdateCabinetDTO);
  }
   @Delete('delete-office')
  @ApiOperation({ summary: 'Удалить офис' })
  @ApiResponse({ status: 200, description: 'Офис удален' })
  async deleteOffice(@Body() deleteOfficeDTO: DeleteOfficeDTO) {
    return await this._officeService.deleteOffice(deleteOfficeDTO);
  }

  @Delete('delete/cabinet')
  @ApiOperation({ summary: 'Удалить кабинет' })
  @ApiResponse({ status: 200, description: 'Кабинет удален' })
  async deleteCabinet(@Body() deleteCabinetDTO: DeleteCabinetDTO) {
    return await this._officeService.deleteCabinet(deleteCabinetDTO);
  }
}
