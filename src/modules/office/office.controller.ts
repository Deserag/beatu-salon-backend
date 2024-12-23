import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OfficeService } from "./office.service";
import { GetOfficeDTO } from "./dto/get-office.dto";
import { CreateOfficeDTO, UpdateOfficeDTO } from "./dto";

@ApiTags('office')
@Controller('office')
export class OfficeController {
    constructor (private readonly _officeService: OfficeService){}

    @Get(':id')
    @ApiOperation({ summary: 'Получить информацию об офисе' })
    @ApiResponse({ status: 200, description: 'Информация об офисе получена корректно' })
    async getOffice(@Param('id') id: string) {
        return await this._officeService.GetOfiiceInfo(id)
    }

    @Post('list')
    @ApiOperation({ summary: 'Получить офисы' })
    @ApiResponse({ status: 200, description: 'Офисы получены корректно' })
    async getOffices(@Body() getOfficeDTO: GetOfficeDTO) {
        return await this._officeService.GetOffice(getOfficeDTO)
    }

    @Post('list/cabinet')
    @ApiOperation({ summary: 'Получить кабинеты' })
    @ApiResponse({ status: 200, description: 'Кабинеты получены корректно' })
    async getCabinetonOffice(@Body() getOfficeDTO: GetOfficeDTO) {
        return await this._officeService.getCabinetonOffice(getOfficeDTO)
    }   

    @Post('create/office')
    @ApiOperation({ summary: 'Создать офис' })
    @ApiResponse({ status: 200, description: 'Офис создан корректно' })
    async createOffice(@Body() createOfficeDTO: CreateOfficeDTO) {
        return await this._officeService.createOffice(createOfficeDTO)
    }


    @Put('update/office')
    @ApiOperation({ summary: 'Обновить офис' })
    @ApiResponse({ status: 200, description: 'Офис обновлен корректно' })
    async updateOffice(@Body() UpdateOfficeDTO: UpdateOfficeDTO) {
        return await this._officeService.updateOffice(UpdateOfficeDTO)
    }
}