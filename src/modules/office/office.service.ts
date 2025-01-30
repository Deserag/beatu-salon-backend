import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException('Ошибка при получении офиса: '+ error.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(
        'Ошибка при получении информации об офисе: '+ error.message, HttpStatus.BAD_REQUEST
      );
    }
  }

  async getCabinetonOffice(getOfficeDTO: GetOfficeDTO) {
    try {
      const { officeId} = getOfficeDTO;
      if (!officeId) {
        throw new HttpException('Недостаточно полей для заполнения', HttpStatus.BAD_REQUEST);
      }
      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.cabinet.findMany({
          where: {
            officeId: officeId,
          },
          skip: (getOfficeDTO.page - 1) * getOfficeDTO.size,
          take: getOfficeDTO.size,
          orderBy: { createdAt: 'desc' },
        }),
        this._prisma.cabinet.count(),
      ]);
      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / getOfficeDTO.size),
        currentPage: getOfficeDTO.page,
      };
    } catch (error) {
      throw new HttpException('Ошибка при получении офиса: '+ error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createOffice(createOfficeDTO: CreateOfficeDTO) {
    if (
      !createOfficeDTO.creatorId ||
      !createOfficeDTO.number ||
      !createOfficeDTO.address
    ) {
      throw new HttpException('Недостаточно полей для заполнения', HttpStatus.BAD_REQUEST);
    }
    try {
      const adminId = await this._prisma.user.findUnique({
        where: { id: createOfficeDTO.creatorId },
      });
      if (!adminId) {
        throw new HttpException('Администратор с указанным ID не найден', HttpStatus.BAD_REQUEST);
      }
      return this._prisma.office.create({
        data: {
          ...createOfficeDTO,
        },
      });
    } catch (error) {
      throw new HttpException('Ошибка при создании офиса: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOffice(createOfficeDTO: UpdateOfficeDTO) {
    if (
      !createOfficeDTO.creatorId ||
      !createOfficeDTO.number ||
      !createOfficeDTO.address
    ) {
      throw new HttpException('Недостаточно полей для заполнения', HttpStatus.BAD_REQUEST);
    }
    try {
      const adminId = await this._prisma.user.findUnique({
        where: { id: createOfficeDTO.creatorId },
      });
      if (!adminId) {
        throw new HttpException('Администратор с указанным ID не найден', HttpStatus.BAD_REQUEST);
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
      throw new HttpException('Ошибка при обновлении офиса: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getStatisticOffice(getStatisticOfficeDTO: GetStatisticOfficeDTO) {}

  async createCabinet(createCabinetDTO: CreateCabinetDTO) {
    const { number, officeId, creatorId } = createCabinetDTO;

    if (!number || !officeId || !creatorId) {
        throw new HttpException('Недостаточно полей для заполнения', HttpStatus.BAD_REQUEST);
    }

    try {
        const office = await this._prisma.office.findUnique({
            where: { id: officeId },
        });
        if (!office) {
            throw new HttpException('Офис с указанным ID не найден', HttpStatus.NOT_FOUND);
        }

        const user = await this._prisma.user.findUnique({
            where: { id: creatorId },
        });
        if (!user) {
            throw new HttpException('Пользователь с указанным ID не найден', HttpStatus.NOT_FOUND);
        }

        const existingCabinet = await this._prisma.cabinet.findFirst({
            where: {
                number: number,
                officeId: officeId,
            },
        });

        if (existingCabinet) {
            throw new HttpException('Кабинет с таким номером уже существует в данном офисе', HttpStatus.CONFLICT);
        }

        return await this._prisma.cabinet.create({
            data: { number, officeId, creatorId, status: 'AVAILABLE' },
        });
    } catch (error) {
        if (error instanceof HttpException) {
            throw error; // Пробрасываем HttpException дальше для обработки централизованным обработчиком
        } else {
            throw new HttpException('Ошибка при создании кабинета: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  }
  async updateCabinet(updateCabinetDTO: UpdateCabinetDTO) {
    const { id, number, officeId, creatorId } = updateCabinetDTO;

    if (!id || !number || !officeId || !creatorId) {
      throw new HttpException('Недостаточно полей для заполнения', HttpStatus.BAD_REQUEST);
    }

    try {
      const cabinet = await this._prisma.cabinet.findUnique({ where: { id } });
      if (!cabinet) throw new HttpException('Кабинет с указанным ID не найден', HttpStatus.BAD_REQUEST);

      const office = await this._prisma.office.findUnique({
        where: { id: officeId },
      });
      if (!office) throw new HttpException('Офис с указанным ID не найден', HttpStatus.BAD_REQUEST);

      const user = await this._prisma.user.findUnique({
        where: { id: creatorId },
      });
      if (!user) throw new HttpException('Пользователь с указанным ID не найден', HttpStatus.BAD_REQUEST);

      return await this._prisma.cabinet.update({
        where: { id },
        data: { number, officeId, creatorId },
      });
    } catch (error) {
      throw new HttpException('Ошибка при обновлении кабинета: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
