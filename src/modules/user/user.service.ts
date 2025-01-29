import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO, GetUserDTO, UpdateUserDTO } from './dto';
import { PutRoleDTO } from './dto/get-role.dto';
import { GetUserRoleDTO } from './dto/get-role.dto';
import { GetUserDepartmentDTO } from './dto/get-department.dto';
import {
  CreateRoleDTO,
  CreateDepartmentDTO,
  UpdateRoleDTO,
  UpdateDepartmentDTO,
} from './dto';
@Injectable()
export class UserService {
  private _prisma = new PrismaClient();

  async getUser(getUserDTO: GetUserDTO) {
    try {
      const { name, page = 1, size = 10 } = getUserDTO;

      if (name) {
        const users = await this._prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: name, mode: 'insensitive' } },
              { lastName: { contains: name, mode: 'insensitive' } },
              { middleName: { contains: name, mode: 'insensitive' } },
            ],
          },
          include: {
            departments: {
              include: {
                department: true,
              },
            },
          },
        });

        if (!users || users.length === 0) {
          throw new Error('Пользователь с указанным именем не найден');
        }

        return { users };
      } else {
        const [rows, totalCount] = await this._prisma.$transaction([
          this._prisma.user.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
            include: {
              departments: {
                include: {
                  department: true,
                },
              },
            },
          }),
          this._prisma.user.count(),
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

  async getRole(getUserRoleDTO: GetUserRoleDTO) {
    try {
      const { name, page = 1, size = 10 } = getUserRoleDTO;

      if (name) {
        const roles = await this._prisma.role.findMany({
          where: {
            name: { contains: name, mode: 'insensitive' },
          },
        });

        if (!roles || roles.length === 0) {
          throw new Error('Роль с указанным именем не найдена');
        }

        return { roles };
      } else {
        const [rows, totalCount] = await this._prisma.$transaction([
          this._prisma.role.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.role.count(),
        ]);

        return {
          rows,
          totalCount,
          totalPages: Math.ceil(totalCount / size),
          currentPage: page,
        };
      }
    } catch (error) {
      throw new Error('Ошибка при получении ролей: ' + error.message);
    }
  }

  async getDepartment(getUserDepartmentDTO: GetUserDepartmentDTO) {
    try {
      const { name, page = 1, size = 10 } = getUserDepartmentDTO;

      if (name) {
        const departments = await this._prisma.department.findMany({
          where: {
            name: { contains: name, mode: 'insensitive' },
          },
        });

        if (!departments || departments.length === 0) {
          throw new Error('Отдел с указанным именем не найден');
        }

        return { departments };
      } else {
        const [rows, totalCount] = await this._prisma.$transaction([
          this._prisma.department.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
          }),
          this._prisma.department.count(),
        ]);

        return {
          rows,
          totalCount,
          totalPages: Math.ceil(totalCount / size),
          currentPage: page,
        };
      }
    } catch (error) {
      throw new Error('Ошибка при получении отделов: ' + error.message);
    }
  }

  async getUserDepartament() {
    try {
      const departments = await this._prisma.department.findMany();
      return departments;
    } catch (error) {
      throw new Error('Ошибка при получении отделов: ' + error.message);
    }
  }

  async getUsersWithDepartment(departmentId: string) {
    try {
      const users = await this._prisma.departmentUser.findMany({
        where: {
          departmentId: departmentId,
        },
      });

      const departmentUsers = await this._prisma.user.findMany({
        where: {
          id: {
            in: users.map((user) => user.userId),
          },
        },
      });

      return departmentUsers;
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

  async updateUserInfo(userDTO: UpdateUserDTO) {
    try {
      const user = await this._prisma.user.findUnique({
        where: { id: userDTO.id },
      });
      if (!user) {
        throw new Error('Пользователь с указанным ID не найден');
      }

      const { departmentIds, ...userData } = userDTO;

      const updatedUser = await this._prisma.user.update({
        where: { id: userDTO.id },
        data: {
          ...userData,
          departments: departmentIds
            ? {
                deleteMany: {},
                create: departmentIds.map((departmentId) => ({
                  departmentId,
                })),
              }
            : undefined,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new Error(
        'Ошибка при обновлении информации пользователя: ' + error.message,
      );
    }
  }

  async createRole(createRoleDTO: CreateRoleDTO) {
    if (!createRoleDTO.name) {
      throw new Error('Недостаточно полей для заполнения');
    }
    try {
      const createRole = await this._prisma.role.create({
        data: {
          ...createRoleDTO,
        },
      });
      return createRole;
    } catch (error) {
      throw new Error('Ошибка при создании роли: ' + error.message);
    }
  }

  async updateRole(updateRoleDTO: UpdateRoleDTO) {
    if (!updateRoleDTO.name || !updateRoleDTO.roleId) {
      throw new Error('Недостаточно полей для обновления');
    }
    try {
      const roleId = await this._prisma.role.findUnique({
        where: { id: updateRoleDTO.roleId },
      });
      if (!roleId) {
        throw new Error('Роль с указанным ID не найдена');
      }

      const updateUser = await this._prisma.role.update({
        where: { id: updateRoleDTO.roleId },
        data: {
          ...updateRoleDTO,
        },
      });
      return updateUser;
    } catch (error) {
      throw new Error('Ошибка при обновлении роли: ' + error.message);
    }
  }

  async createDepartment(createDepartmentDTO: CreateDepartmentDTO) {
    if (!createDepartmentDTO.name ) {
      throw new Error('Недостаточно полей для заполнения');
    }
    try {
      const createdDepartment = await this._prisma.department.create({
        data: {
          ...createDepartmentDTO,
        },
      });
      return createdDepartment;
    } catch (error) {
      throw new Error('Ошибка при создании отдела: ' + error.message);
    }
  }

  async updateDepartmentInfo() {}

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

  async putUserRole(roleDTO: PutRoleDTO) {
    try {
      const adminId = roleDTO.adminId;
    } catch (error) {
      throw new Error('Ошибка при создании роли:' + error.message);
    }
  }

  async putNewRole() {}

  async CreateUserRole(creteRoleDTO: CreateRoleDTO) {
    try {
      const createdUserRole = await this._prisma.role.create({
        data: {
          ...creteRoleDTO,
        },
      });

      return createdUserRole;
    } catch (error) {
      throw new Error('Ошибка при создании роли:' + error.message);
    }
  }

  async getUserRoles() {
    const role = await this._prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    console.log(role);
    return role;
  }

  async getUserInfo(userId: string) {
    try {
      const user = await this._prisma.user.findUnique({
        where: { id: userId },
      });

      const userRole = await this._prisma.role.findUnique({
        where: { id: user.roleId },
        select: { name: true },
      });
      return { user, userRole };
    } catch (error) {
      throw new Error('Ошибка при получении пользователя:' + error.message);
    }
  }
}
