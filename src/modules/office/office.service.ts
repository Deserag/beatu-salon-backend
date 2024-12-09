import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateOfficeDTO } from "./dto";
import { GetStatisticOfficeDTO } from "./dto/get-statistic-office.dto";
import { CreateCabinetDTO } from "./dto/create-cabinet.dto";

@Injectable()
export class OfficeService {
    private _prisma = new PrismaClient()

    async GetOffice() {}

    async getCabinetonOffice() {
        
    }

    async createOffice(createOfficeDTO: CreateOfficeDTO){

    }

    async updateOffice(createOfficeDTO: CreateOfficeDTO){ 

    }

    async getStatisticOffice(getStatisticOfficeDTO: GetStatisticOfficeDTO){

    }

    async createCabinet(createCabinet: CreateCabinetDTO){

    }
    async updateCabinet(updateCabinet: CreateCabinetDTO){}
}