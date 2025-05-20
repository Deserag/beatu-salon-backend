import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteRoleDTO {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'ID пользователя' })
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'ID роли' })
    roleId: string;
}

export class DeleteUserDTO {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'ID админа' })
    adminId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'ID пользователя' })
    userId: string;
}

export class DeleteDepartmentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'ID админа' })
  adminId: string;
}