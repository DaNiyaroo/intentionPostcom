import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    
    @ApiProperty({ description: 'Юзернейм' })
    @IsString()
    username: string

    @ApiProperty({ description: 'Имя пользователя' })
    @IsString()
    firstname: string

    @ApiProperty({ description: 'Фамилия пользователя' })
    @IsString()
    @IsOptional()
    lastname: string

    @ApiProperty({ description: 'Номер телефона' })
    @IsNumber()
    @IsOptional()
    phone: number

    @ApiProperty({ description: 'Пароль' })
    @IsStrongPassword()
    password: string

    @ApiProperty({ description: 'Електронный адрес' })
    @IsEmail()
    email: string

}