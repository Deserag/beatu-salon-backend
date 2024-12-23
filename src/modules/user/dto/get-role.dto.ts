import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetUserRoleDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    name: string

    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1, required: true})
    page: 5

    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 10, required: true})
    size: 10
}

export class PutRoleDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    adminId: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    userId: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    role: string
}
export class UpdateRoleDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    adminId: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    roleId: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    description: string
}
export class CreateRoleDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    creatorId: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    description: string
}