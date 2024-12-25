import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateOfficeDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: 'id пользователя', required: true})
    creatorId: string;

    @IsOptional()
    @IsString()
    @ApiProperty({example: 'номер офиса', required: true})
    number: string;

    @IsOptional()
    @IsString()
    @ApiProperty({example: 'id кабинета', required: true})
    address: string;

}

export class UpdateOfficeDTO extends CreateOfficeDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: 'id офиса', required: true})
    id: string;
}