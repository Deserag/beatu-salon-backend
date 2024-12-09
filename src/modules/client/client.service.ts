import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateClientDTO,
  CreateOrderClientDTO,
  GetClientDTO,
  GetClientOrderDTO,
} from './dto';

@Injectable()
export class ClientService {
  private _prisma = new PrismaClient();

  async getClients(clienDTO: GetClientDTO) {
    try {
      if (clienDTO.name) {
        const client = await this._prisma.$transaction([
          this._prisma.client.findMany({
            where: {
              OR: [
                { firstName: clienDTO.name },
                { lastName: clienDTO.name },
                { middleName: clienDTO.name },
              ],
            },
            skip: (clienDTO.page - 1) * clienDTO.size,
            take: clienDTO.size,
          }),
        ]);

        return {
          client,
          currentPage: clienDTO.page,
        };
      } else {
        const [client, totalCount] = await this._prisma.$transaction([
          this._prisma.client.findMany({
            skip: (clienDTO.page - 1) * clienDTO.size,
            take: clienDTO.size,
          }),
          this._prisma.client.count(),
        ]);

        return {
          client,
          totalCount,
          totalPages: Math.ceil(totalCount / clienDTO.size),
          currentPage: clienDTO.page,
        };
      }
    } catch (error) {
      throw new Error('Ошибка при получении клиентов');
    }
  }

  async getOrdersClients(clientDTO: GetClientOrderDTO) {}

  async createClient(clientDTO: CreateClientDTO) {}

  async updateClient(clientDTO: CreateClientDTO) {}

  async createOrderClient(createClientOrder: CreateOrderClientDTO) {}

  async updateOrderClient(updateClientOrder: CreateOrderClientDTO) {}
}
