import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GetMeaningDTO } from '../dto';
import {
  CreateDepartmentDTO,
  CreateRoleDTO,
  CreateUserDTO,
  DeleteDepartmentDTO,
  DeleteRoleDTO,
  DeleteUserDTO,
  GetUserDepartmentDTO,
  PutRoleDTO,
  UpdateRoleDTO,
  UpdateUserDTO,
} from './dto';
import { parseISO } from 'date-fns';
@Injectable()
export class UserService {
  private _prisma = new PrismaClient();

  async getUser(getUserDTO: GetMeaningDTO) {
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
          throw new HttpException(
            'Пользователь с указанным именем не найден',
            HttpStatus.BAD_REQUEST,
          );
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
      throw new HttpException(
        'Ошибка при получении пользователей: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRole(getUserRoleDTO: GetMeaningDTO) {
    try {
      const { name, page = 1, size = 10 } = getUserRoleDTO;

      if (name) {
        const roles = await this._prisma.role.findMany({
          where: {
            name: { contains: name, mode: 'insensitive' },
          },
        });

        if (!roles || roles.length === 0) {
          throw new HttpException(
            'Роль с указанным именем не найдена',
            HttpStatus.BAD_REQUEST,
          );
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
      throw new HttpException(
        'Ошибка при получении ролей: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
          throw new HttpException(
            'Отдел с указанным именем не найден',
            HttpStatus.BAD_REQUEST,
          );
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
      throw new HttpException(
        'Ошибка при получении отделов: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserDepartament() {
    try {
      const departments = await this._prisma.department.findMany();
      return departments;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении отделов: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'Ошибка при получении пользователей: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(createUserDTO: CreateUserDTO) {
    if (
      !createUserDTO.login ||
      !createUserDTO.password ||
      !createUserDTO.firstName ||
      !createUserDTO.lastName
    ) {
      throw new HttpException(
        'Недостаточно данных для создания пользователя. Логин, пароль, имя и фамилия обязательны.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const userLogin = await this._prisma.user.findUnique({
        where: { login: createUserDTO.login },
      });

      if (userLogin) {
        throw new HttpException(
          'Пользователь с таким логином уже существует',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (createUserDTO.telegramId) {
        const userTelegramId = await this._prisma.user.findFirst({
          where: { telegramId: createUserDTO.telegramId },
        });

        if (userTelegramId) {
          throw new HttpException(
            'Пользователь с таким Telegram ID уже существует',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (createUserDTO.email) {
        const userEmail = await this._prisma.user.findFirst({
          where: { email: createUserDTO.email },
        });

        if (userEmail) {
          throw new HttpException(
            'Пользователь с таким email уже существует',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const data: any = {
        ...createUserDTO,
      };

      if (createUserDTO.roleId) {
        data.role = {
          connect: { id: createUserDTO.roleId },
        };
        delete data.roleId;
      }

      delete data.id;

      if (createUserDTO.birthDate) {
        data.birthDate = parseISO(createUserDTO.birthDate);
      }

      if (createUserDTO.departments && createUserDTO.departments.length > 0) {
        data.departments = {
          connect: createUserDTO.departments.map((departmentId) => ({
            id: departmentId,
          })),
        };
      }
      delete data.departments;

      const createdUser = await this._prisma.user.create({
        data,
      });

      return createdUser;
    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target || 'уникальное поле';
        throw new HttpException(
          `Нарушение уникальности: ${target} уже используется.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Ошибка при создании пользователя: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserInfo(userDTO: UpdateUserDTO) {
    try {
      const user = await this._prisma.user.findUnique({
        where: { id: userDTO.id },
      });
      if (!user) {
        throw new HttpException(
          'Пользователь с указанным ID не найден',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { departments, ...userData } = userDTO;

      const updatedUser = await this._prisma.user.update({
        where: { id: userDTO.id },
        data: {
          ...userData,
          departments: departments
            ? {
                deleteMany: {},
                create: departments.map((departmentId) => ({
                  departmentId,
                })),
              }
            : undefined,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new HttpException(
        'Ошибка при обновлении информации пользователя: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRole(createRoleDTO: CreateRoleDTO) {
    if (!createRoleDTO.name) {
      throw new HttpException(
        'Недостаточно полей для заполнения',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const createRole = await this._prisma.role.create({
        data: {
          ...createRoleDTO,
        },
      });
      return createRole;
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании роли: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRole(updateRoleDTO: UpdateRoleDTO) {
    if (!updateRoleDTO.name || !updateRoleDTO.roleId) {
      throw new HttpException(
        'Недостаточно полей для обновления',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const roleId = await this._prisma.role.findUnique({
        where: { id: updateRoleDTO.roleId },
      });
      if (!roleId) {
        throw new HttpException(
          'Роль с указанным ID не найдена',
          HttpStatus.NOT_FOUND,
        );
      }

      const updateUser = await this._prisma.role.update({
        where: { id: updateRoleDTO.roleId },
        data: {
          ...updateRoleDTO,
        },
      });
      return updateUser;
    } catch (error) {
      throw new HttpException(
        'Ошибка при обновлении роли: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDepartment(createDepartmentDTO: CreateDepartmentDTO) {
    if (!createDepartmentDTO.name) {
      throw new HttpException(
        'Недостаточно полей для заполнения',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const createdDepartment = await this._prisma.department.create({
        data: {
          ...createDepartmentDTO,
        },
      });
      return createdDepartment;
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании отдела: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDepartmentInfo() {}

  async assignUserToCabinet(userId: string, cabinetId: string) {
    try {
      const cabinet = await this._prisma.cabinet.findUnique({
        where: { id: cabinetId },
      });
      if (!cabinet) {
        throw new HttpException(
          'Кабинет с указанным ID не найден',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this._prisma.userOnCabinet.create({
        data: { userId, cabinetId },
      });

      return { message: 'Пользователь успешно прикреплен к кабинету' };
    } catch (error) {
      throw new HttpException(
        'Ошибка при прикреплении пользователя к кабинету: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      throw new HttpException(
        'Ошибка при удалении пользователя из кабинета: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async putUserRole(roleDTO: PutRoleDTO) {
    try {
      const adminId = roleDTO.adminId;
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании роли:' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'Ошибка при создании роли:' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserRoles() {
    const role = await this._prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
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
      throw new HttpException(
        'Ошибка при получении пользователя:' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRole(deleteRoleDTO: DeleteRoleDTO) {
    try {
      const user = await this._prisma.user.findUnique({
        where: { id: deleteRoleDTO.userId },
        select: { roleId: true },
      });

      const role = await this._prisma.role.findUnique({
        where: { id: user.roleId },
      });
      if (role.name == 'ADMIN' || role.name == 'Manager') {
        throw new HttpException(
          'У вас нет прав для удаления ролей',
          HttpStatus.FORBIDDEN,
        );
      }
      const deletedRole = await this._prisma.role.delete({
        where: {
          id: deleteRoleDTO.roleId,
        },
      });
      return deletedRole;
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении роли:' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(deleteUserDTO: DeleteUserDTO) {
    try {
      const user = await this._prisma.user.findUnique({
        where: { id: deleteUserDTO.userId },
        select: { roleId: true },
      });

      const role = await this._prisma.role.findUnique({
        where: { id: user.roleId },
      });
      if (role.name !== 'ADMIN' && role.name !== 'Manager') {
        throw new HttpException(
          'У вас нет прав для удаления пользователей',
          HttpStatus.FORBIDDEN,
        );
      }
      const deletedUser = await this._prisma.user.delete({
        where: {
          id: deleteUserDTO.userId,
        },
      });
      return deletedUser;
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении пользователя:' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDepartment(deleteDepartmentDTO: DeleteDepartmentDTO) {
    try {
      const user = await this._prisma.user.findUnique({
        where: { id: deleteDepartmentDTO.adminId },
        select: { roleId: true },
      });

      const role = await this._prisma.role.findUnique({
        where: { id: user.roleId },
      });
      if (role.name !== 'ADMIN' && role.name !== 'Manager') {
        throw new HttpException(
          'У вас нет прав для удаления отделов',
          HttpStatus.FORBIDDEN,
        );
      }
      const deletedDepartment = await this._prisma.department.delete({
        where: {
          id: deleteDepartmentDTO.departmentId,
        },
      });
      return deletedDepartment;
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении отдела:' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
