import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateClientDTO,
  CreateOrderClientDTO,
  GetClientDTO,
  UpdateClientDTO,
  UpdateOrderDTO,
} from './dto';
import { GetOrderDTO } from './dto/get-order.dto';

@Injectable()
export class ClientService {
  private _prisma = new PrismaClient();

  async getClientById(clientId: string) {
    try {
      const client = await this._prisma.user.findUnique({
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
          userId: clientId,
          result: 'DONE',
          deletedAt: null,
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
      const userRole = await this._prisma.role.findFirst({
        where: {
          name: 'User',
        },
        select: {
          id: true,
        },
      });

      if (!userRole) {
        throw new HttpException(
          'Роль "User" не найдена в системе.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (name) {
        const clients = await this._prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: name, mode: 'insensitive' } },
              { lastName: { contains: name, mode: 'insensitive' } },
              { middleName: { contains: name, mode: 'insensitive' } },
            ],
            AND: [{ roleId: userRole.id }],
            deletedAt: null,
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
          this._prisma.user.findMany({
            where: {
              role: {
                id: userRole.id,
              },
              deletedAt: null,
            },
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.user.count({
            where: {
              role: { id: userRole.id },
              deletedAt: null,
            },
          }),
        ]);

        return {
          rows,
          infoPage: {
            totalCount,
            totalPages: Math.ceil(totalCount / size),
            currentPage: page,
            pageSize: size,
          },
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при получении пользователей: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrders(getOrder: GetOrderDTO) {
    try {
      const { name, page = 1, size = 10 } = getOrder;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      if (name) {
        const users = await this._prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: name, mode: 'insensitive' } },
              { lastName: { contains: name, mode: 'insensitive' } },
              { middleName: { contains: name, mode: 'insensitive' } },
            ],
            deletedAt: null,
          },
          select: { id: true },
        });

        if (!users || users.length === 0) {
          throw new HttpException(
            'Пользователь с указанным именем не найден, поэтому заказы не могут быть отфильтрованы.',
            HttpStatus.BAD_REQUEST,
          );
        }

        const userIds = users.map((user) => user.id);

        const orders = await this._prisma.serviceRecord.findMany({
          where: {
            userId: { in: userIds },
            deletedAt: null,
            dateTime: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
          include: {
            user: true,
            worker: true,
            service: true,
            office: true,
            cabinet: true,
          },
        });

        if (!orders || orders.length === 0) {
          throw new HttpException(
            'Заказы для пользователя с указанным именем не найдены',
            HttpStatus.BAD_REQUEST,
          );
        }

        return { orders };
      } else {
        const [rows, totalCount] = await this._prisma.$transaction([
          this._prisma.serviceRecord.findMany({
            where: {
              deletedAt: null,
              dateTime: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
            include: {
              user: true,
              worker: true,
              service: true,
              office: true,
              cabinet: true,
            },
          }),
          this._prisma.serviceRecord.count({
            where: {
              deletedAt: null,
              dateTime: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
          }),
        ]);

        return {
          rows,
          infoPage: {
            totalCount,
            totalPages: Math.ceil(totalCount / size),
            currentPage: page,
            pageSize: size,
          },
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при получении заказов: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createClient(createClientDTO: CreateClientDTO) {
    const { telegramId, firstName, lastName, middleName, birthDate } =
      createClientDTO;

    if (!telegramId || !firstName || !lastName || !birthDate) {
      throw new HttpException(
        'Недостаточно полей для заполнения',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this._prisma.role.findFirst({
      where: {
        name: 'User',
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      throw new HttpException(
        'Роль "User" не найдена в системе.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      return await this._prisma.user.create({
        data: {
          telegramId,
          firstName,
          lastName,
          middleName,
          login: '',
          password: '',
          email: '',
          roleId: role.id,
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
      const client = await this._prisma.user.findUnique({ where: { id } });
      if (!client)
        throw new HttpException(
          'Клиент с указанным ID не найден',
          HttpStatus.BAD_REQUEST,
        );

      if (client.deletedAt) {
        throw new HttpException(
          'Невозможно обновить: клиент удален',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this._prisma.user.update({
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
      if (error instanceof HttpException) {
        throw error;
      }
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
        where: { id: workerId, deletedAt: null },
      });
      const client = await this._prisma.user.findUnique({
        where: { id: clientId, deletedAt: null },
      });
      const service = await this._prisma.service.findUnique({
        where: { id: serviceId, deletedAt: null },
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
          deletedAt: null,
          AND: [
            {
              dateTime: {
                lt: orderEndTime,
              },
            },
            {
              dateTime: {
                gte: orderStartTime,
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
        data: {
          dateTime: orderStartTime,
          result: createOrderDTO.result,
          office: {
            connect: { id: createOrderDTO.officeId },
          },
          cabinet: {
            connect: { id: createOrderDTO.workCabinetId },
          },
          service: {
            connect: { id: createOrderDTO.serviceId },
          },
          user: {
            connect: { id: createOrderDTO.clientId },
          },
          worker: {
            connect: { id: createOrderDTO.workerId },
          },
        },
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
      const orderToUpdate = await this._prisma.serviceRecord.findUnique({
        where: { id: updateOrderDTO.orderId },
      });

      if (!orderToUpdate) {
        throw new HttpException(
          'Обновляемый заказ не найден',
          HttpStatus.NOT_FOUND,
        );
      }

      if (orderToUpdate.deletedAt) {
        throw new HttpException(
          'Невозможно обновить: заказ удален',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this._prisma.user.findUnique({
        where: { id: updateOrderDTO.workerId, deletedAt: null },
      });
      const client = await this._prisma.user.findUnique({
        where: { id: updateOrderDTO.clientId, deletedAt: null },
      });

      const service = await this._prisma.service.findUnique({
        where: { id: updateOrderDTO.serviceId, deletedAt: null },
      });

      if (!client || !user || !service) {
        throw new HttpException(
          'Клиент или сотрудник или услуга не найдены',
          HttpStatus.BAD_REQUEST,
        );
      }

      const serviceDuration = service.duration;
      const orderStartTime = new Date(updateOrderDTO.dateTime);
      const orderEndTime = new Date(
        orderStartTime.getTime() + serviceDuration * 60 * 60 * 1000,
      );

      const conflictingOrder = await this._prisma.serviceRecord.findFirst({
        where: {
          workerId: updateOrderDTO.workerId,
          deletedAt: null,
          id: { not: updateOrderDTO.orderId },
          AND: [
            {
              dateTime: {
                lt: orderEndTime,
              },
            },
            {
              dateTime: {
                gte: orderStartTime,
              },
            },
          ],
        },
      });

      if (conflictingOrder) {
        throw new HttpException(
          'У мастера уже есть другой заказ в это время. Пожалуйста, выберите другое время.',
          HttpStatus.CONFLICT,
        );
      }

      return await this._prisma.serviceRecord.update({
        where: {
          id: updateOrderDTO.orderId,
        },
        data: {
          dateTime: new Date(updateOrderDTO.dateTime),
          result: updateOrderDTO.result,
          officeId: updateOrderDTO.officeId,
          workCabinetId: updateOrderDTO.workCabinetId,
          serviceId: updateOrderDTO.serviceId,
          userId: updateOrderDTO.clientId,
          workerId: updateOrderDTO.workerId,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при обновлении заказа: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrderSoftly(orderId: string) {
    try {
      const order = await this._prisma.serviceRecord.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new HttpException(
          'Заказ с указанным ID не найден',
          HttpStatus.NOT_FOUND,
        );
      }

      if (order.deletedAt) {
        throw new HttpException('Заказ уже удален', HttpStatus.BAD_REQUEST);
      }

      return await this._prisma.serviceRecord.update({
        where: { id: orderId },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при мягком удалении заказа: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteClientSoftly(clientId: string) {
    try {
      const client = await this._prisma.user.findUnique({
        where: { id: clientId },
      });

      if (!client) {
        throw new HttpException(
          'Клиент с указанным ID не найден',
          HttpStatus.NOT_FOUND,
        );
      }

      if (client.deletedAt) {
        throw new HttpException('Клиент уже удален', HttpStatus.BAD_REQUEST);
      }

      return await this._prisma.user.update({
        where: { id: clientId },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при мягком удалении клиента: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
