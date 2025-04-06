import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateProductDTO,
  CreateProductForSaleDTO,
  CreateServiceDTO,
  UpdateProductDTO,
  UpdateServiceDTO,
} from './dto';
import { GetMeaningDTO } from '../dto';
import { CreateWorkerOnServiceDTO, UpdateWorkerOnServiceDTO } from './dto/create-workers-service.dto';

@Injectable()
export class ServiceService {
  private _prisma = new PrismaClient();
  async GetServiceForId(id: string) {
    try {
      const service = await this._prisma.service.findUnique({
        where: { id },
      });
      if (!service) {
        throw new Error('Сервис с указанным ID не найден');
      } else {
        return service;
      }
    } catch (error) {
      throw new Error('Ошибка при получении услуги: ' + error.message);
    }
  }
  async GetProductForId(id: string) {}

  async  getAllWorkerOnService(getServiceDTO: GetMeaningDTO) {
    try {
      const workersOnService = await this._prisma.workerOnService.findMany({
        where: {
          serviceId: getServiceDTO.name,
        },
        include: {
          worker: true,
        },
        skip: (getServiceDTO.page - 1) * getServiceDTO.size,
        take: getServiceDTO.size,
      });
      return workersOnService;
    } catch (error) {
      console.error("Ошибка при получении мастеров для услуги:", error);
      throw error;
    } finally {
      await this._prisma.$disconnect();
    }
  }
  async getWorkerOnServiceByIds(serviceId: string, userId: string) {
    try {
      return this._prisma.workerOnService.findUnique({
        where: {
          serviceId_userId: {
            serviceId,
            userId,
          },
        },
        include: {
          worker: true,
          service: true,
        },
      });
    } catch (error) {
      throw new Error(`Ошибка при получении связи: ${error.message}`);
    }
  }


  async GetProfuctForSaleForId(id: string) {}

  async GetUserProvidingServiceForId(id: string) {}

  async GetService(serviceId: string) {}

  async GetServicesList(getServiceDTO: GetMeaningDTO) {
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
      console.log('Ошибка получения', error);
      throw new HttpException('Ошибка получения пользователей' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async GetProductsList(getProductDTO: GetMeaningDTO) {
    try {
      const { name, page = 1, size = 10 } = getProductDTO;
      if (name) {
        const products = await this._prisma.product.findMany({
          where: {
            name: { contains: name, mode: 'insensitive' },
          },
        });
        if (!products || products.length == 0) {
          throw new Error('Товар с указанным именем не найден');
        }
        return { products };
      } else {
        const [rows, totalCount] = await this._prisma.$transaction([
          this._prisma.product.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.product.count(),
        ]);
        return {
          rows,
          totalCount,
          totalPages: Math.ceil(totalCount / size),
          currentPage: page,
        };
      }
    } catch (error) {
      throw new Error('Ошибка получения товара' + error.message);
    }
  }

  async GetProfuctsForSaleList() {}

  async CreateService(createServiceDTO: CreateServiceDTO) {
    if (!CreateServiceDTO.name) {
      throw new Error('Недостаточно полей для заполнения');
    }
    try {
      const creatorId = await this._prisma.user.findUnique({
        where: { id: createServiceDTO.creatorId },
      });

      if (!creatorId) {
        throw new Error('Администратор с указанным ID не найден');
      }

      const createService = await this._prisma.service.create({
        data: {
          ...createServiceDTO,
        },
      });
      return createService;
    } catch (error) {
      throw new Error('Ошибка при создании услуги: ' + error.message);
    }
  }

  async CreateProduct(createProductDTO: CreateProductDTO) {
    if (!createProductDTO.name) {
      throw new Error('Недостаточно полей для заполнения');
    }

    try {
      const creatorId = await this._prisma.user.findUnique({
        where: { id: createProductDTO.creatorId },
      });

      if (!creatorId) {
        throw new Error('Администратор с указанным ID не найден');
      }

      const createProduct = await this._prisma.product.create({
        data: {
          ...createProductDTO,
        },
      });
      return createProduct;
    } catch (error) {
      throw new Error('Ошибка при создании товара: ' + error.message);
    }
  }

  async createWorkerOnService(dto: CreateWorkerOnServiceDTO) {
    const { serviceId, userIds, creatorId } = dto;

    try {
      const creatorRole = await this._prisma.user.findUnique({
        where: { id: creatorId },
        include: { role: true },
      });

      if (!creatorRole || (creatorRole.role.name !== 'Admin' && creatorRole.role.name !== 'SuperAdmin')) {
        throw new ForbiddenException('Недостаточно прав');
      }

      const workers = await this._prisma.user.findMany({
        where: { id: { in: userIds } },
        include: { role: true },
      });

      workers.forEach(worker => {
        if (!worker || (worker.role.name !== 'Worker')) {
          throw new ForbiddenException('Недостаточно прав у одного из мастеров');
        }
      });

      const createOperations = userIds.map((userId) =>
        this._prisma.workerOnService.create({
          data: {
            serviceId,
            userId,
            creatorId,
          },
        }),
      );

      return this._prisma.$transaction(createOperations);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Ошибка при создании связей: ${error.message}`);
    }
  }

 
  async UpdateProduct(updateProductDTO: UpdateProductDTO) {
    try {
      const { productId, name, quantity } = updateProductDTO;

      const product = await this._prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Товар с указанным ID не найден');
      }

      return await this._prisma.product.update({
        where: { id: productId },
        data: { name, quantity },
      });
    } catch (error) {
      throw new Error('Ошибка при обновлении товара: ' + error.message);
    }
  }

  async UpdateService(updateServiceDTO: UpdateServiceDTO) {
    try {
      const { id, name, description, price } = updateServiceDTO;

      const service = await this._prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new Error('Услуга с указанным ID не найдена');
      }

      return await this._prisma.service.update({
        where: { id },
        data: { name, description, price },
      });
    } catch (error) {
      throw new Error('Ошибка при обновлении услуги: ' + error.message);
    }
  }

  async updateWorkerOnService(dto: UpdateWorkerOnServiceDTO) {
    const { serviceId, userIds, creatorId } = dto;

    try {
      const creatorRole = await this._prisma.user.findUnique({
        where: { id: creatorId },
        include: { role: true },
      });

      if (!creatorRole || (creatorRole.role.name !== 'Admin' && creatorRole.role.name !== 'SuperAdmin')) {
        throw new ForbiddenException('Недостаточно прав');
      }

      await this._prisma.workerOnService.deleteMany({
        where: { serviceId },
      });

      const createOperations = userIds.map((userId) =>
        this._prisma.workerOnService.create({
          data: {
            serviceId,
            userId,
            creatorId,
          },
        }),
      );

      return this._prisma.$transaction(createOperations);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Ошибка при обновлении связей: ${error.message}`);
    }
  }

  async DeleteService(serviceId: string) {
    try {
      const service = await this._prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        throw new Error('Услуга с указанным ID не найдена');
      }

      return await this._prisma.service.update({
        where: { id: serviceId },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new Error('Ошибка при удалении услуги: ' + error.message);
    }
  }

  async DeleteProduct(productId: string) {
    try {
      const product = await this._prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Товар с указанным ID не найден');
      }

      return await this._prisma.product.update({
        where: { id: productId },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new Error('Ошибка при удалении товара: ' + error.message);
    }
  }
  async deleteWorkerOnService(serviceId: string, userId: string) {
    return this._prisma.workerOnService.delete({
      where: {
        serviceId_userId: {
          serviceId,
          userId,
        },
      },
    });
  }
}

  // async DeleteProductForSale(saleId: string) {
  //     try {
  //         const sale = await this._prisma.productSale.findUnique({
  //             where: { id: saleId },
  //         });

  //         if (!sale) {
  //             throw new Error('Продажа с указанным ID не найдена');
  //         }

  //         const officeProduct = await this._prisma.productOffice.findUnique({
  //             where: { officeId_productId: { officeId: sale.officeId, productId: sale.productId } },
  //         });

  //         if (officeProduct) {
  //             await this._prisma.productOffice.update({
  //                 where: { officeId_productId: { officeId: sale.officeId, productId: sale.productId } },
  //                 data: { quantity: officeProduct.quantity + sale.quantity },
  //             });
  //         }

  //         return await this._prisma.productSale.delete({
  //             where: { id: saleId },
  //         });
  //     } catch (error) {
  //         throw new Error('Ошибка при удалении продажи товара: ' + error.message);
  //     }
  // }

