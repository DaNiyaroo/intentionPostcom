import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class FindAllDto {

    @IsNumber({maxDecimalPlaces: 0})
    @IsOptional()
    @Type(() => Number)
    page: number

    @IsNumber({maxDecimalPlaces: 0})
    @IsOptional()
    @Type(() => Number)
    limit: number

    @IsOptional()
    @IsString()
    search: string;
}