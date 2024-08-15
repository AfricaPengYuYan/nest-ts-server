import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { QueryTodoDto, TodoDto, UpdateTodoDto } from "./todo.dto";
import { TodoService } from "./todo.service";

import { ApiResult } from "~/common/decorators/api-result.decorator";
import { IdParam } from "~/common/decorators/id-param.decorator";

import { Permission, definePermission } from "~/common/decorators/permission.decorator";
import { Resource } from "~/common/decorators/resource.decorator";
import { ResourceGuard } from "~/common/guards/resource.guard";
import { Pagination } from "~/helper/paginate/pagination";

import { TodoEntity } from "~/modules/todo/todo.entity";

export const permissions = definePermission("todo", {
    LIST: "list",
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
} as const);

@ApiTags("Business - Todo模块")
@UseGuards(ResourceGuard)
@Controller("todo")
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    @ApiOperation({ summary: "获取Todo列表" })
    @ApiResult({ type: [TodoEntity] })
    @Permission(permissions.LIST)
    async list(@Query() dto: QueryTodoDto): Promise<Pagination<TodoEntity>> {
        return this.todoService.list(dto);
    }

    @Get(":id")
    @ApiOperation({ summary: "获取Todo详情" })
    @ApiResult({ type: TodoEntity })
    @Permission(permissions.READ)
    async info(@IdParam() id: number): Promise<TodoEntity> {
        return this.todoService.detail(id);
    }

    @Post()
    @ApiOperation({ summary: "创建Todo" })
    @Permission(permissions.CREATE)
    async create(@Body() dto: TodoDto): Promise<void> {
        await this.todoService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "更新Todo" })
    @Permission(permissions.UPDATE)
    @Resource(TodoEntity)
    async update(@IdParam() id: number, @Body() dto: UpdateTodoDto): Promise<void> {
        await this.todoService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "删除Todo" })
    @Permission(permissions.DELETE)
    @Resource(TodoEntity)
    async delete(@IdParam() id: number): Promise<void> {
        await this.todoService.delete(id);
    }
}
