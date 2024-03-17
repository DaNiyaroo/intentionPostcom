import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
    
    @ApiProperty({ description: 'Рефреш токен' })
    @IsString()
    readonly refreshToken: string;
}