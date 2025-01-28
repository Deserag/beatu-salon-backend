import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOfficeDTO, UpdateOfficeDTO } from './dto';
import { GetStatisticOfficeDTO } from './dto/get-statistic-office.dto';
import { CreateCabinetDTO, UpdateCabinetDTO } from './dto/create-cabinet.dto';
import { GetOfficeDTO } from './dto/get-office.dto';
import { error } from 'console';

@Injectable()
export class OfficeService {
  private _prisma = new PrismaClient();

  async GetOffice(getOfficeDTO: GetOfficeDTO) {
    try {
      const { page = 1, size = 10 } = getOfficeDTO;

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.office.findMany({
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
        }),
        this._prisma.office.count(),
      ]);
      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new Error('Ошибка при получении офиса: ' + error.message);
    }
  }

  async GetCabinetInfo(id: string){

  }

  async GetOfiiceInfo(officeId: string) {
    try {
      const office = await this._prisma.office.findUnique({
        where: { id: officeId },
      });

      const cabinets = await this._prisma.cabinet.findMany({
        where: { officeId: officeId },
      });
      return {
        office,
        cabinets,
      };
    } catch (error) {
      throw new Error(
        'Ошибка при получении информации об офисе: ' + error.message,
      );
    }
  }

  async getCabinetonOffice(getOfficeDTO: GetOfficeDTO) {
    try {
      const { officeId, page = 1, size = 10 } = getOfficeDTO;
      if (officeId) {
        throw new Error('Недостаточно полей для заполнения');
      }
      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.cabinet.findMany({
          where: {
            officeId: officeId,
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
        }),
        this._prisma.cabinet.count(),
      ]);
      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new Error('Ошибка при получении офиса: ' + error.message);
    }
  }

  async createOffice(createOfficeDTO: CreateOfficeDTO) {
    if (
      !createOfficeDTO.creatorId ||
      !createOfficeDTO.number ||
      !createOfficeDTO.address
    ) {
      throw new Error('Недостаточно полей для заполнения');
    }
    try {
      const adminId = await this._prisma.user.findUnique({
        where: { id: createOfficeDTO.creatorId },
      });
      if (!adminId) {
        throw new Error('Администратор с указанным ID не найден');
      }
      return this._prisma.office.create({
        data: {
          ...createOfficeDTO,
        },
      });
    } catch (error) {
      throw new Error('Ошибка при создании офиса: ' + error.message);
    }
  }

  async updateOffice(createOfficeDTO: UpdateOfficeDTO) {
    if (
      !createOfficeDTO.creatorId ||
      !createOfficeDTO.number ||
      !createOfficeDTO.address
    ) {
      throw new Error('Недостаточно полей для заполнения');
    }
    try {
      const adminId = await this._prisma.user.findUnique({
        where: { id: createOfficeDTO.creatorId },
      });
      if (!adminId) {
        throw new Error('Администратор с указанным ID не найден');
      }
      return this._prisma.office.update({
        where: {
          id: createOfficeDTO.id,
        },
        data: {
          ...createOfficeDTO,
        },
      });
    } catch (error) {
      throw new Error('Ошибка при обновлении офиса: ' + error.message);
    }
  }

  async getStatisticOffice(getStatisticOfficeDTO: GetStatisticOfficeDTO) {}

  async createCabinet(createCabinetDTO: CreateCabinetDTO) {
    const { number, officeId, creatorId } = createCabinetDTO;

    if (!number || !officeId || !creatorId) {
      throw new Error('Недостаточно полей для заполнения');
    }

    try {
      const office = await this._prisma.office.findUnique({
        where: { id: officeId },
      });
      if (!office) throw new Error('Офис с указанным ID не найден');

      const user = await this._prisma.user.findUnique({
        where: { id: creatorId },
      });
      if (!user) throw new Error('Пользователь с указанным ID не найден');

      return await this._prisma.cabinet.create({
        data: { number, officeId, creatorId, status: 'AVAILABLE' },
      });
    } catch (error) {
      throw new Error('Ошибка при создании кабинета: ' + error.message);
    }
  }
  async updateCabinet(updateCabinetDTO: UpdateCabinetDTO) {
    const { id, number, officeId, creatorId } = updateCabinetDTO;

    if (!id || !number || !officeId || !creatorId) {
      throw new Error('Недостаточно полей для заполнения');
    }

    try {
      const cabinet = await this._prisma.cabinet.findUnique({ where: { id } });
      if (!cabinet) throw new Error('Кабинет с указанным ID не найден');

      const office = await this._prisma.office.findUnique({
        where: { id: officeId },
      });
      if (!office) throw new Error('Офис с указанным ID не найден');

      const user = await this._prisma.user.findUnique({
        where: { id: creatorId },
      });
      if (!user) throw new Error('Пользователь с указанным ID не найден');

      return await this._prisma.cabinet.update({
        where: { id },
        data: { number, officeId, creatorId },
      });
    } catch (error) {
      throw new Error('Ошибка при обновлении кабинета: ' + error.message);
    }
  }
}
