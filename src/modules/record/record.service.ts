import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RecordService {
  private _prisma = new PrismaClient();
}
