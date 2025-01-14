import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateServiceUserList {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'id услуги',
        required: true,
    })
    serviceId: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'id пользователей',
        required: true,
    })
    userId: string[]
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'id создателя',
        required: true,
    })
    creatorId: string
}