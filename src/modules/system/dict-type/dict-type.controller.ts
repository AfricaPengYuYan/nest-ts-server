import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiResult } from "~/common/decorators/api-result.decorator";
import { IdParam } from "~/common/decorators/id-param.decorator";
import { definePermission, Permission } from "~/common/decorators/permission.decorator";
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator";
import { CreatorPipe } from "~/common/pipes/creator.pipe";
import { UpdaterPipe } from "~/common/pipes/updater.pipe";
import { Pagination } from "~/helper/paginate/pagination";
import { DictTypeEntity } from "~/modules/system/dict-type/dict-type.entity";

import { DictTypeDto, QueryDictTypeDto } from "./dict-type.dto";

import { DictTypeService } from "./dict-type.service";

export const permissions = definePermission("system:dict-type", {
    LIST: "list",
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
} as const);

@ApiTags("System - 字典类型模块")
@ApiSecurityAuth()
@Controller("dict-type")
export class DictTypeController {
    constructor(private dictTypeService: DictTypeService) { }

    @Get()
    @ApiOperation({ summary: "获取字典类型列表" })
    @ApiResult({ type: [DictTypeEntity], isPage: true })
    @Permission(permissions.LIST)
    async list(@Query() dto: QueryDictTypeDto): Promise<Pagination<DictTypeEntity>> {
        return this.dictTypeService.page(dto);
    }

    @Get("select-options")
    @ApiOperation({ summary: "一次性获取所有的字典类型(不分页)" })
    @ApiResult({ type: [DictTypeEntity] })
    @Permission(permissions.LIST)
    async getAll(): Promise<DictTypeEntity[]> {
        return this.dictTypeService.getAll();
    }

    @Post()
    @ApiOperation({ summary: "新增字典类型" })
    @Permission(permissions.CREATE)
    async create(@Body(CreatorPipe) dto: DictTypeDto): Promise<void> {
        await this.dictTypeService.create(dto);
    }

    @Get(":id")
    @ApiOperation({ summary: "查询字典类型信息" })
    @ApiResult({ type: DictTypeEntity })
    @Permission(permissions.READ)
    async info(@IdParam() id: number): Promise<DictTypeEntity> {
        return this.dictTypeService.findOne(id);
    }

    @Post(":id")
    @ApiOperation({ summary: "更新字典类型" })
    @Permission(permissions.UPDATE)
    async update(@IdParam() id: number, @Body(UpdaterPipe) dto: DictTypeDto): Promise<void> {
        await this.dictTypeService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "删除指定的字典类型" })
    @Permission(permissions.DELETE)
    async delete(@IdParam() id: number): Promise<void> {
        await this.dictTypeService.delete(id);
    }
}
