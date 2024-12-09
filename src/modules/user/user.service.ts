import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateServiceDTO, CreateUserDTO, GetUserDTO } from './dto';
import { parse } from 'path';
import { PutRoleDTO } from './dto/put-role.dto';
import { CreateUserRoleDTO } from './dto/create-user-role.dto';

@Injectable()
export class UserService {
  private _prisma = new PrismaClient();

  async getUser(getUserDTO: GetUserDTO) {
    try {
      const { name, page = 1, size = 10 } = getUserDTO;

      if (name) {
        const user = await this._prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: name, mode: 'insensitive' } },
              { lastName: { contains: name, mode: 'insensitive' } },
              { middleName: { contains: name, mode: 'insensitive' } },
            ],
          },
        });

        if (!user || user.length === 0) {
          throw new Error('Пользователь с указанным именем не найден');
        }

        return { user };
      } else {
        const [users, totalCount] = await this._prisma.$transaction([
          this._prisma.user.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.user.count(),
        ]);

        return {
          users,
          totalCount,
          totalPages: Math.ceil(totalCount / size),
          currentPage: page,
        };
      }
    } catch (error) {
      throw new Error('Ошибка при получении пользователей: ' + error.message);
    }
  }

  async createUser(createUserDTO: CreateUserDTO) {
    if (
      !createUserDTO.login ||
      !createUserDTO.password ||
      !createUserDTO.firstName ||
      !createUserDTO.lastName
    ) {
      throw new Error(
        'Недостаточно данных для создания пользователя. Логин, пароль, имя и фамилия обязательны.',
      );
    }

    try {
      const userLogin = await this._prisma.user.findUnique({
        where: { login: createUserDTO.login },
      });

      if (userLogin) {
        throw new Error('Пользователь с таким логином уже существует');
      }

      if (createUserDTO.telegramId) {
        const userTelegramId = await this._prisma.user.findFirst({
          where: { telegramId: createUserDTO.telegramId },
        });

        if (userTelegramId) {
          throw new Error('Пользователь с таким Telegram ID уже существует');
        }
      }

      if (createUserDTO.email) {
        const userEmail = await this._prisma.user.findFirst({
          where: { email: createUserDTO.email },
        });

        if (userEmail) {
          throw new Error('Пользователь с таким email уже существует');
        }
      }
      const createdUser = await this._prisma.user.create({
        data: {
          ...createUserDTO,
        },
      });

      return createdUser;
    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target || 'уникальное поле';
        throw new Error(`Нарушение уникальности: ${target} уже используется.`);
      }

      throw new Error('Ошибка при создании пользователя: ' + error.message);
    }
  }

  async updateUserInfo(id: string, userDTO: CreateUserDTO) {
    try {
      const user = await this._prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new Error('Пользователь с указанным ID не найден');
      }

      const updatedUser = await this._prisma.user.update({
        where: { id },
        data: userDTO,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(
        'Ошибка при обновлении информации пользователя: ' + error.message,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this._prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new Error('Пользователь с указанным ID не найден');
      }

      await this._prisma.user.delete({ where: { id } });
      return { message: 'Пользователь успешно удален' };
    } catch (error) {
      throw new Error('Ошибка при удалении пользователя: ' + error.message);
    }
  }

  async assignUserToCabinet(userId: string, cabinetId: string) {
    try {
      const cabinet = await this._prisma.cabinet.findUnique({
        where: { id: cabinetId },
      });
      if (!cabinet) {
        throw new Error('Кабинет с указанным ID не найден');
      }

      await this._prisma.userOnCabinet.create({
        data: { userId, cabinetId },
      });

      return { message: 'Пользователь успешно прикреплен к кабинету' };
    } catch (error) {
      throw new Error(
        'Ошибка при прикреплении пользователя к кабинету: ' + error.message,
      );
    }
  }

  async removeUserFromCabinet(userId: string, cabinetId: string) {
    try {
      await this._prisma.userOnCabinet.delete({
        where: {
          cabinetId_userId: { userId, cabinetId },
        },
      });

      return { message: 'Пользователь успешно удален из кабинета' };
    } catch (error) {
      throw new Error(
        'Ошибка при удалении пользователя из кабинета: ' + error.message,
      );
    }
  }

  async putUserRole(roleDTO: PutRoleDTO){
    try {
      const  adminId = roleDTO.adminId
    }
    catch (error){
      throw new Error('Ошибка при создании роли:' + error.message);
    }
  }

  async putNewRole(){

  }

  async getUserRole(){
    return await this._prisma.role.findMany()
  }

  async CreateUserRole(creteRoleDTO: CreateUserRoleDTO){
    try {
      const createdUserRole = await this._prisma.role.create({
        data: {
          ...creteRoleDTO,
        },
      });

      return createdUserRole;
    }
    catch (error){
      throw new Error('Ошибка при создании роли:' + error.message);
    }
  }
}
