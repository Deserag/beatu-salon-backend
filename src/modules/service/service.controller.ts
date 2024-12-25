import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaClient } from "@prisma/client";

@ApiTags('service')
@Controller('service')
export class ServiceController {
private _prisma = new PrismaClient();


}