import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetMeaningDTO } from '../dto';
import {
  CreateDepartmentDTO,
  CreateRoleDTO,
  CreateUserDTO,
  DeleteDepartmentDto,
  DeleteRoleDTO,
  DeleteUserDTO,
  GetUserDepartmentDTO,
  UpdateDepartmentDTO,
  UpdateUserDTO,
} from './dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}
  @Get('user-roles')
  @ApiOperation({ summary: 'Получение ролей' })
  @ApiResponse({ status: 200, description: 'Роли успешно получены' })
  @ApiResponse({ status: 404, description: 'Роли не найдены' })
  async getUserRoles() {
    return await this._userService.getUserRoles();
  }
  @Get('user-departaments')
  @ApiOperation({ summary: 'Получение проффесий' })
  @ApiResponse({ status: 200, description: 'Проффесии успешно получены' })
  @ApiResponse({ status: 404, description: 'Проффесии не найдены' })
  async getDepartments() {
    return await this._userService.getDepartments();
  }
  

  @Get('users-department')
  @ApiOperation({ summary: 'Получение пользователей' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно получены' })
  @ApiResponse({ status: 404, description: 'Пользователи не найдены' })
  async getDepartmentUsers(@Param('departmentId') departmentId: string) {
    return await this._userService.getDepartmentUsers(departmentId);
  }

  @Get('users-earnings')
  @ApiOperation({ summary: 'Получение прибыли работника' })
  @ApiResponse({ status: 200, description: 'Прибыль работника успешно получены' })
  @ApiResponse({ status: 404, description: 'Прибыль не найдена' })
  async getUserEarnings(@Param('userId') userId: string) {
    return await this._userService.getUserEarnings(userId);
  }

  @Get('users-department/:departmentId')
  @ApiOperation({ summary: 'Получение пользователей по ID проффесии' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно получены' })
  @ApiResponse({ status: 404, description: 'Пользователи не найдены' })
  async getUsersWithDepartment(@Param('departmentId') departmentId: string) {
    return await this._userService.getUsersWithDepartment(departmentId);
  }

  @Get('departaments')
  @ApiOperation({ summary: 'Получение направления' })
  @ApiResponse({ status: 200, description: 'Направления успешно получены' })
  @ApiResponse({ status: 404, description: 'Направления не найдены' })
  async getUserDepartaments() {
    return await this._userService.getUserDepartament();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Получение информации о пользователе' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно получен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getUserInfo(@Param('id') id: string) {
    return await this._userService.getUserInfo(id);
  }

  @Post('list')
  @ApiOperation({ summary: 'Поиск пользователей с фильтрами' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно найдены' })
  @ApiResponse({ status: 404, description: 'Пользователи не найдены' })
  async usersList(@Body() getUserDTO: GetMeaningDTO) {
    return await this._userService.getUser(getUserDTO);
  }

  @Post('list-roles')
  @ApiOperation({ summary: 'Поиск роли с фильтрами' })
  @ApiResponse({ status: 200, description: 'Роли успешно найдены' })
  @ApiResponse({ status: 404, description: 'Роли не найдены' })
  async usersListRoles(@Body() getUserRoleDTO: GetMeaningDTO) {
    return await this._userService.getRole(getUserRoleDTO);
  }
  @Post('list-departments')
  @ApiOperation({ summary: 'Поиск направления с фильтрами' })
  @ApiResponse({ status: 200, description: 'Направления успешно найдены' })
  @ApiResponse({ status: 404, description: 'Направления не найдены' })
  async usersListDepartment(@Body() GetDepartmentDTO: GetUserDepartmentDTO) {
    return await this._userService.getDepartment(GetDepartmentDTO);
  }

  @Post('create-user')
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания пользователя',
  })
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this._userService.createUser(createUserDTO);
  }

  @Post('create-roles')
  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 201, description: 'Роль успешно создана' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания роли',
  })
  async createRoles(@Body() createRoleDTO: CreateRoleDTO) {
    return await this._userService.createRole(createRoleDTO);
  }

  @Post('create-department')
  @ApiOperation({ summary: 'Создание проффесии' })
  @ApiResponse({ status: 201, description: 'Проффесия успешно создана' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно данных для создания проффесии',
  })
  async createDepartment(@Body() CreateDepartmentDTO: CreateDepartmentDTO) {
    return await this._userService.createDepartment(CreateDepartmentDTO);
  }

  @Put('update')
  @ApiOperation({ summary: 'Обновление информации пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Информация пользователя успешно обновлена',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async updateUser(@Body() updateUserDTO: UpdateUserDTO) {
    return await this._userService.updateUserInfo(updateUserDTO);
  }
  @Put('update-department')
  @ApiOperation({ summary: 'Обновление информации об отделе' })
  @ApiResponse({ status: 200, description: 'Информация об отделе успешно обновлена' })
  @ApiResponse({ status: 400, description: 'Недостаточно данных для обновления' })
  @ApiResponse({ status: 404, description: 'Отдел с указанным ID не найден' })
  @ApiResponse({ status: 409, description: 'Отдел с таким названием уже существует' })
  async updateDepartment(@Body() updateDepartmentDTO: UpdateDepartmentDTO) {
    return this._userService.updateDepartmentInfo(updateDepartmentDTO);
  }

  @Post('assign-cabinet')
  @ApiOperation({ summary: 'Прикрепить пользователя к кабинету' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно прикреплен к кабинету',
  })
  @ApiResponse({
    status: 404,
    description: 'Кабинет или пользователь не найдены',
  })
  async assignUserToCabinet(
    @Body() { userId, cabinetId }: { userId: string; cabinetId: string },
  ) {
    return await this._userService.assignUserToCabinet(userId, cabinetId);
  }

  @Post('remove-cabinet')
  @ApiOperation({ summary: 'Удалить пользователя из кабинета' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно удален из кабинета',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь или кабинет не найдены',
  })
  async removeUserFromCabinet(
    @Body() { userId, cabinetId }: { userId: string; cabinetId: string },
  ) {
    return await this._userService.removeUserFromCabinet(userId, cabinetId);
  }

  @Delete('delete-role')
  @ApiOperation({ summary: 'Удаление роли' })
  @ApiResponse({ status: 200, description: 'Роль успешно удалена' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  async deleteRole(@Body() deleteRoleDTO: DeleteRoleDTO) {
    return await this._userService.deleteRole(deleteRoleDTO);
  }

  @Delete('delete-user')
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async deleteUser(@Body() deleteUserDTO: DeleteUserDTO) {
    return await this._userService.deleteUser(deleteUserDTO);
  }

  @Delete('delete-department/:departmentId')
  @ApiOperation({ summary: 'Удаление отделения' })
  @ApiResponse({ status: 200, description: 'Отделение успешно удалено' })
  @ApiResponse({ status: 404, description: 'Отделение не найдено' })
  async deleteDepartment(
    @Param('departmentId') departmentId: string,
    @Body() deleteDepartmentDto: DeleteDepartmentDto,
  ) {
    return await this._userService.deleteDepartment(deleteDepartmentDto, departmentId);
  }
}
