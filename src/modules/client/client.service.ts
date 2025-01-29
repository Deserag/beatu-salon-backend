import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateClientDTO,
  CreateOrderClientDTO,
  GetClientDTO,
  UpdateClientDTO,
} from './dto';

@Injectable()
export class ClientService {
  async getClientById(clientId: string) {
    try {
      const client = await this._prisma.client.findUnique({
        where: { id: clientId },
        include: {
          serviceRecords: true,
          clientHistories: true,
          reviews: true,
        },
      });

      if (!client) throw new Error('Клиент с указанным ID не найден');

      return client;
    } catch (error) {
      throw new Error(
        'Ошибка при получении информации о клиенте: ' + error.message,
      );
    }
  }

  async getClients(getClientDTO: GetClientDTO) {
    try {
      const { name, page = 1, size = 10 } = getClientDTO;

      if (name) {
        const clients = await this._prisma.client.findMany({
          where: {
            OR: [
              { firstName: { contains: name, mode: 'insensitive' } },
              { lastName: { contains: name, mode: 'insensitive' } },
              { middleName: { contains: name, mode: 'insensitive' } },
            ],
          },
        });

        if (!clients || clients.length === 0) {
          throw new Error('Пользователь с указанным именем не найден');
        }

        return { clients };
      } else {
        const [rows, totalCount] = await this._prisma.$transaction([
          this._prisma.client.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.client.count(),
        ]);

        return {
          rows,
          totalCount,
          totalPages: Math.ceil(totalCount / size),
          currentPage: page,
        };
      }
    } catch (error) {
      throw new Error('Ошибка при получении пользователей: ' + error.message);
    }
  }
  private _prisma = new PrismaClient();

  async createClient(createClientDTO: CreateClientDTO) {
    const { telegramId, firstName, lastName, middleName, birthDate } =
      createClientDTO;

    if (!telegramId || !firstName || !lastName || !birthDate) {
      throw new Error('Недостаточно полей для заполнения');
    }

    try {
      return await this._prisma.client.create({
        data: {
          telegramId,
          firstName,
          lastName,
          middleName,
          birthDate: new Date(birthDate),
        },
      });
    } catch (error) {
      throw new Error('Ошибка при создании клиента: ' + error.message);
    }
  }

  async updateClient(updateClientDTO: UpdateClientDTO) {
    const { id, telegramId, firstName, lastName, middleName, birthDate } =
      updateClientDTO;

    if (!id || !telegramId || !firstName || !lastName || !birthDate) {
      throw new Error('Недостаточно полей для заполнения');
    }

    try {
      const client = await this._prisma.client.findUnique({ where: { id } });
      if (!client) throw new Error('Клиент с указанным ID не найден');

      return await this._prisma.client.update({
        where: { id },
        data: {
          telegramId,
          firstName,
          lastName,
          middleName,
          birthDate: new Date(birthDate),
        },
      });
    } catch (error) {
      throw new Error('Ошибка при обновлении клиента: ' + error.message);
    }
  }

  async createOrder(createOrderDTO: CreateOrderClientDTO) {
    if (
      !createOrderDTO.clientId ||
      !createOrderDTO.workerId ||
      !createOrderDTO.dateTime ||
      !createOrderDTO.serviceId
    ) {
      throw new Error(
        'Недостаточно данных для создания пользователя. Логин, пароль, имя и фамилия обязательны.',
      );
    }
    try {
      const user = await this._prisma.user.findUnique({
        where: {
          id: createOrderDTO.workerId,
        },
      });
      const client = await this._prisma.client.findUnique({
        where: {
          id: createOrderDTO.clientId,
        },
      });

      const service = await this._prisma.service.findUnique({
        where: {
          id: createOrderDTO.serviceId,
        },
      });

      if (!client || !user || !service) {
        throw new Error('Клиент или сотрудник или услуга не найдены');
      } else {
        return await this._prisma.serviceRecord.create({
          data: {
            ...createOrderDTO,
          },
        });
      }
    } catch (error) {
      throw new Error('Ошибка при создании пользователя: ' + error.message);
    }
  }
}
