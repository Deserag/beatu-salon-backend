import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateServiceDTO, GetServiceDTO } from './dto';

@Injectable()
export class ServiceService {
  private _prisma = new PrismaClient();
  async GetServiceForId(id: string) {}
  async GetProductForId(id: string) {}

  async GetProfuctForSaleForId(id: string) {}

  async GetUserProvidingServiceForId(id: string) {}

  async GetService(getServiceDTO: GetServiceDTO) {
    try {
      const { name, page = 1, size = 10 } = getServiceDTO;

      if (name) {
        const services = await this._prisma.service.findMany({
          where: {
            name: { contains: name, mode: 'insensitive' },
          },
        });
        if (!services || services.length == 0) {
          throw new Error('Сервис с указанным именем не найден');
        }
        return { services };
      } else {
        const [rows, totalCount] = await this._prisma.$transaction([
          this._prisma.service.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.service.count(),
        ]);

        return {
          rows,
          totalCount,
          totalPages: Math.ceil(totalCount / size),
          currentPage: page,
        };
      }
    } catch (error) {
      throw new Error('Ошибка получения пользователей' + error.message);
    }
  }

  async GetServicesList() {}

  async GetProductsList() {}

  async GetProfuctsForSaleList() {}

  async CreateService(createServiceDTO: CreateServiceDTO) {
    if (
      !createServiceDTO.name ||
      !createServiceDTO.price ||
      !createServiceDTO.creatorId
    ) {
      throw new Error('Все поля должны быть заполнены');
    }
    try {
      const admin = await this._prisma.user.findUnique({
        where: {
          id: createServiceDTO.creatorId,
        },
      });
      if (!admin) {
        throw new Error('Администратор с указанным ID не найден');
      }
      const role = await this._prisma.role.findUnique({
        where: {
          id: admin.roleId,
        },
        select: {
          name: true,
        },
      });

      const name = await this._prisma.service.findFirst({
        where: {
          name: createServiceDTO.name,
        },
      });
      if (role.name != 'Admin' && role.name != 'Manager' && !role) {
        console.log(role.name);
        throw new Error('Недостаточно прав для создания сервиса');
      }
      if (name) {
        throw new Error('Сервис с таким именем уже существует');
      } else {
        const createdService = await this._prisma.service.create({
          data: {
            ...createServiceDTO,
          },
        });
        return createdService;
      }
    } catch (error) {
      throw new Error('Ошибка при создании сервиса: ' + error.message);
    }
  }

  async CreateProduct() {}

  async CreateProfuctForSale() {}

  async UpdateProductForSale() {}

  async UpdateProduct() {}

  async UpdateService() {}

  async DeleteService() {}

  async DeleteProduct() {}

  async DeleteProductForSale() {}
}
