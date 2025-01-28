import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateClientDTO, UpdateClientDTO } from './dto';

@Injectable()
export class ClientService {
  private _prisma = new PrismaClient();

  async createClient(createClientDTO: CreateClientDTO) {
    const { telegramId, firstName, lastName, middleName, birthDate } = createClientDTO;

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
    const { id, telegramId, firstName, lastName, middleName, birthDate } = updateClientDTO;

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

  async getClientById(clientId: string) {
    try {
      const client = await this._prisma.client.findUnique({
        where: { id: clientId },
        include: {
          serviceRecords: true, // История записей на услуги
          clientHistories: true, // История посещений
          reviews: true, // Отзывы
        },
      });

      if (!client) throw new Error('Клиент с указанным ID не найден');

      return client;
    } catch (error) {
      throw new Error('Ошибка при получении информации о клиенте: ' + error.message);
    }
  }

  async getClients(page: number = 1, size: number = 10) {
    try {
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
    } catch (error) {
      throw new Error('Ошибка при получении списка клиентов: ' + error.message);
    }
  }
}