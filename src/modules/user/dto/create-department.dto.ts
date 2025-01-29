import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class CreateDepartmentDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    description: string
}

export class UpdateDepartmentDTO  extends CreateDepartmentDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    departmentId: string
}