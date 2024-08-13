import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { Allow, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export enum ORDER {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class PageDto<T = any> {
    @ApiProperty({ minimum: 1, default: 1 })
    @Min(1)
    @IsInt()
    @Expose()
    @IsOptional({ always: true })
    @Transform(({ value: val }) => (val ? Number.parseInt(val) : 1), {
        toClassOnly: true,
    })
    page?: number

    @ApiProperty({ minimum: 1, maximum: 100, default: 10 })
    @Min(1)
    @Max(100)
    @IsInt()
    @IsOptional({ always: true })
    @Expose()
    @Transform(({ value: val }) => (val ? Number.parseInt(val) : 10), {
        toClassOnly: true,
    })
    pageSize?: number

    @ApiProperty()
    @IsString()
    @IsOptional()
    field?: string // | keyof T

    @ApiProperty({ enum: ORDER })
    @IsEnum(ORDER)
    @IsOptional()
    @Transform(({ value }) => (value === 'asc' ? ORDER.ASC : ORDER.DESC))
    order?: ORDER

    @Allow()
    _t?: number
}
