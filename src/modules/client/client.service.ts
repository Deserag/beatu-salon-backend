import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateClientDTO,
  CreateOrderClientDTO,
  GetClientDTO,
  UpdateClientDTO,
  UpdateOrderDTO,
} from './dto';

@Injectable()
export class ClientService {
  async getClientById(clientId: string) {
    try {
      const client = await this._prisma.client.findUnique({
        where: { id: clientId },
        include: {
          clientHistories: true,
          reviews: true,
        },
      });

      if (!client)
        throw new HttpException(
          'Клиент с указанным ID не найден',
          HttpStatus.BAD_REQUEST,
        );

      return client;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении информации о клиенте: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getClientOrders(clientId: string) {
    try {
      const orders = await this._prisma.serviceRecord.findMany({
        where: {
          clientId: clientId,
          result: 'DONE',
        },
      });
      return orders;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении информации о клиенте: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
          throw new HttpException(
            'Пользователь с указанным именем не найден',
            HttpStatus.BAD_REQUEST,
          );
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
      throw new HttpException(
        'Ошибка при получении пользователей: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private _prisma = new PrismaClient();

  async createClient(createClientDTO: CreateClientDTO) {
    const { telegramId, firstName, lastName, middleName, birthDate } =
      createClientDTO;

    if (!telegramId || !firstName || !lastName || !birthDate) {
      throw new HttpException(
        'Недостаточно полей для заполнения',
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        'Ошибка при создании клиента: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateClient(updateClientDTO: UpdateClientDTO) {
    const { id, telegramId, firstName, lastName, middleName, birthDate } =
      updateClientDTO;

    if (!id || !telegramId || !firstName || !lastName || !birthDate) {
      throw new HttpException(
        'Недостаточно полей для заполнения',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const client = await this._prisma.client.findUnique({ where: { id } });
      if (!client)
        throw new HttpException(
          'Клиент с указанным ID не найден',
          HttpStatus.BAD_REQUEST,
        );

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
      throw new HttpException(
        'Ошибка при обновлении клиента: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOrder(createOrderDTO: CreateOrderClientDTO) {
    const { clientId, workerId, dateTime, serviceId } = createOrderDTO;

    if (!clientId || !workerId || !dateTime || !serviceId) {
      throw new HttpException(
        'Недостаточно данных для создания заказа. ID клиента, ID сотрудника, дату и ID услуги обязательны.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this._prisma.user.findUnique({
        where: { id: workerId },
      });
      const client = await this._prisma.client.findUnique({
        where: { id: clientId },
      });
      const service = await this._prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!client || !user || !service) {
        throw new HttpException(
          'Клиент или сотрудник или услуга не найдены',
          HttpStatus.BAD_REQUEST,
        );
      }

      const serviceDuration = service.duration; 

      const orderStartTime = new Date(dateTime);
      const orderEndTime = new Date(
        orderStartTime.getTime() + serviceDuration * 60 * 60 * 1000,
      ); 
      const conflictingOrder = await this._prisma.serviceRecord.findFirst({
        where: {
          workerId: workerId,
          OR: [
            {
              dateTime: {
                lte: orderEndTime, 
              },
            },
            {
              dateTime: {
                gte: orderStartTime, // Начало существующего заказа позже начала нового
              },
            },
          ],
        },
      });

      if (conflictingOrder) {
        throw new HttpException(
          'У мастера уже есть заказ в это время. Пожалуйста, выберите другое время.',
          HttpStatus.CONFLICT,
        );
      }

      return await this._prisma.serviceRecord.create({
        data: { ...createOrderDTO, dateTime: orderStartTime },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Ошибка при создании заказа: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateOrder(updateOrderDTO: UpdateOrderDTO) {
    if (
      !updateOrderDTO.clientId ||
      !updateOrderDTO.workerId ||
      !updateOrderDTO.dateTime ||
      !updateOrderDTO.serviceId ||
      !updateOrderDTO.orderId
    ) {
      throw new HttpException(
        'Недостаточно данных для обновления заказа. ID заказа, ID клиента, ID сотрудника, дату и ID услуги обязательны.',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const user = await this._prisma.user.findUnique({
        where: {
          id: updateOrderDTO.workerId,
        },
      });
      const client = await this._prisma.client.findUnique({
        where: {
          id: updateOrderDTO.clientId,
        },
      });

      const service = await this._prisma.service.findUnique({
        where: {
          id: updateOrderDTO.serviceId,
        },
      });

      if (!client || !user || !service) {
        throw new HttpException(
          'Клиент или сотрудник или услуга не найдены',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return await this._prisma.serviceRecord.update({
          where: {
            id: updateOrderDTO.orderId,
          },
          data: {
            ...updateOrderDTO,
          },
        });
      }
    } catch (error) {
      throw new HttpException(
        'Ошибка при обновлении пользователя: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
