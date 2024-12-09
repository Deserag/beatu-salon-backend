import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRoleDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'id создателя', required: true })
    creatorId: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Название роли', required: true })
    name: string

}