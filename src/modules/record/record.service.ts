import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateRecordDTO,
  UpdateRecordDTO,
  ChangeRecordStatusDTO,
  GetRecordListDTO,
} from './dto';
export class RecordService {
  private _prisma = new PrismaClient();

  async GetMastersByService(serviceId: string) {
    return this._prisma.workerOnService.findMany({
      where: { serviceId },
      include: {
        worker: true,
      },
    });
  }

  async GetRecordById(id: string) {
    const record = await this._prisma.serviceRecord.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('Запись не найдена');
    return record;
  }

  async GetRecordList(dto: GetRecordListDTO) {
    try {
      const { userId, workerId, serviceId, page = 1, size = 10 } = dto;

      const whereClause: any = {};

      if (userId) whereClause.userId = userId;
      if (workerId) whereClause.workerId = workerId;
      if (serviceId) whereClause.serviceId = serviceId;

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.serviceRecord.findMany({
          where: whereClause,
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          include: {
            user: true,
            service: true,
            worker: true,
            office: true,
          },
        }),
        this._prisma.serviceRecord.count({ where: whereClause }),
      ]);

      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении записей: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async CreateRecord(dto: CreateRecordDTO) {
    const workerHasService = await this._prisma.workerOnService.findUnique({
      where: {
        serviceId_userId: {
          serviceId: dto.serviceId,
          userId: dto.masterId,
        },
      },
    });

    if (!workerHasService) {
      throw new BadRequestException(
        'The selected master does not provide this service.',
      );
    }

    if (!dto.cabinetId) {
      throw new BadRequestException('Cabinet ID is required.');
    }

    const record = await this._prisma.serviceRecord.create({
      data: {
        user: {
          connect: { id: dto.clientId },
        },
        worker: {
          connect: { id: dto.masterId },
        },
        service: {
          connect: { id: dto.serviceId },
        },
        office: {
          connect: { id: dto.officeId },
        },
        cabinet: {
          connect: { id: dto.cabinetId },
        },
        dateTime: new Date(dto.dateTime),
      },
    });

    return record;
  }

  async UpdateRecord(dto: UpdateRecordDTO) {
    const exists = await this._prisma.serviceRecord.findUnique({
      where: { id: dto.id },
    });
    if (!exists || exists.deletedAt)
      throw new NotFoundException('Запись не найдена');

    const workerHasService = await this._prisma.workerOnService.findUnique({
      where: {
        serviceId_userId: { serviceId: dto.serviceId, userId: dto.masterId },
      },
    });
    if (!workerHasService)
      throw new BadRequestException('Мастер не предоставляет эту услугу');

    const conflict = await this._prisma.serviceRecord.findFirst({
      where: {
        workerId: dto.masterId,
        dateTime: dto.dateTime,
        deletedAt: null,
        NOT: { id: dto.id },
      },
    });
    if (conflict) throw new BadRequestException('Мастер занят на это время');

    return this._prisma.serviceRecord.update({
      where: { id: dto.id },
      data: dto,
    });
  }

  async ChangeRecordStatus(dto: ChangeRecordStatusDTO) {
    const exists = await this._prisma.serviceRecord.findUnique({
      where: { id: dto.id },
    });
    if (!exists || exists.deletedAt)
      throw new NotFoundException('Запись не найдена');

    return this._prisma.serviceRecord.update({
      where: { id: dto.id },
      data: { result: dto.status },
    });
  }
}
