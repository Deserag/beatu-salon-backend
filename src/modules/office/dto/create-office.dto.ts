import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateOfficeDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: 'id пользователя', required: true})
    id: string;

    @IsOptional()
    @IsString()
    @ApiProperty({example: 'номер офиса', required: true})
    number: string;

    @IsOptional()
    @IsString()
    @ApiProperty({example: 'id кабинета', required: true})
    adress: string;

}