import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
  
    @ApiProperty({ description: 'Юзернейм или Эмайл для входа' })
    @IsString()
    usernameOrEmail: string;
 
    @ApiProperty({ description: 'пароль' })
    @IsString()
    password: string;
}
