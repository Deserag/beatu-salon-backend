import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetOrderDTO {
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