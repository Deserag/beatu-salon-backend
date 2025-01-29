import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateDepartmentUserDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'айди', required: true })
    userId: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'айди', required: true })
    departmentId: string
}