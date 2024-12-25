import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GetServiceDTO } from './dto';

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
        if (!services || services.length == 0){
          throw new Error('Сервис с указанным именем не найден');
        }
        return { services };
      } else {
        const [rows,totalCount] = await this._prisma.$transaction([
          this._prisma.service.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.service.count(),
        ])

        return {
          rows,
          totalCount,
          totalPages: Math.ceil(totalCount / size),
          currentPage: page,
        }
      }
    } catch (error) {
      throw new Error('Ошибка получения пользователей' + error.message);
    }
  }

  async GetServicesList() {}

  async GetProductsList() {}

  async GetProfuctsForSaleList() {}

  async CreateService() {}

  async CreateProduct() {}

  async CreateProfuctForSale() {}

  async UpdateProductForSale() {}

  async UpdateProduct() {}

  async UpdateService() {}

  async DeleteService() {}

  async DeleteProduct() {}

  async DeleteProductForSale() {}
}
