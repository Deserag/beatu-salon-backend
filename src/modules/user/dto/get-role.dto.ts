import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";



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
