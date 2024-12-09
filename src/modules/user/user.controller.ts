import { Body, Controller, Delete, Get, Post, Put, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUserDTO } from './dto/get-user.dto';
import { CreateUserDTO } from './dto';
import { CreateUserRoleDTO } from './dto/create-user-role.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('list')
  @ApiOperation({ summary: 'Поиск пользователей с фильтрами' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно найдены' })
  @ApiResponse({ status: 404, description: 'Пользователи не найдены' })
  async usersList(@Body() getUserDTO: GetUserDTO) {
    return await this._userService.getUser(getUserDTO);
  }

  @Post('create')
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Недостаточно данных для создания пользователя' })
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this._userService.createUser(createUserDTO);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Обновление информации пользователя' })
  @ApiResponse({ status: 201, description: 'Информация пользователя успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async updateUser(@Param('id') id: string, @Body() updateUserDTO:CreateUserDTO) {
    return await this._userService.updateUserInfo(id, updateUserDTO);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async deleteUser(@Param('id') id: string) {
    return await this._userService.deleteUser(id);
  }

  @Post('assign-cabinet')
  @ApiOperation({ summary: 'Прикрепить пользователя к кабинету' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно прикреплен к кабинету' })
  @ApiResponse({ status: 404, description: 'Кабинет или пользователь не найдены' })
  async assignUserToCabinet(
    @Body() { userId, cabinetId }: { userId: string; cabinetId: string }
  ) {
    return await this._userService.assignUserToCabinet(userId, cabinetId);
  }

  @Post('remove-cabinet')
  @ApiOperation({ summary: 'Удалить пользователя из кабинета' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален из кабинета' })
  @ApiResponse({ status: 404, description: 'Пользователь или кабинет не найдены' })
  async removeUserFromCabinet(
    @Body() { userId, cabinetId }: { userId: string; cabinetId: string }
  ) {
    return await this._userService.removeUserFromCabinet(userId, cabinetId);
  }

  @Post('create/role')
  @ApiOperation({summary: 'Создание роли'})
  @ApiResponse({status: 201, description: 'Роль успешно создана'})
  @ApiResponse({status: 400, description: 'Недостаточно данных для создания роли'})
  async createRole(@Body() createRoleDTO: CreateUserRoleDTO) {
    return await this._userService.CreateUserRole(createRoleDTO);
  }
}


