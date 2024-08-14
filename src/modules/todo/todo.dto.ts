import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsString } from 'class-validator'

import { PageDto } from '~/dto/pager.dto'

export class TodoDto {
    @ApiProperty({ description: '名称' })
    @IsString()
    value: string
}

export class UpdateTodoDto extends PartialType(TodoDto) { }

export class QueryTodoDto extends IntersectionType(PageDto, TodoDto) { }
