import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ParamConfigDto, QueryParamConfigDto } from "./param-config.dto";
import { ParamConfigService } from "./param-config.service";

import { ApiResult } from "~/common/decorators/api-result.decorator";
import { IdParam } from "~/common/decorators/id-param.decorator";
import { Permission, definePermission } from "~/common/decorators/permission.decorator";
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator";
import { Pagination } from "~/helper/paginate/pagination";
import { ParamConfigEntity } from "~/modules/system/param-config/param-config.entity";

export const permissions = definePermission("system:param-config", {
    LIST: "list",
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
} as const);

@ApiTags("System - 参数配置模块")
@ApiSecurityAuth()
@Controller("param-config")
export class ParamConfigController {
    constructor(private paramConfigService: ParamConfigService) { }

    @Get()
    @ApiOperation({ summary: "获取参数配置列表" })
    @ApiResult({ type: [ParamConfigEntity], isPage: true })
    @Permission(permissions.LIST)
    async list(@Query() dto: QueryParamConfigDto): Promise<Pagination<ParamConfigEntity>> {
        return this.paramConfigService.page(dto);
    }

    @Post()
    @ApiOperation({ summary: "新增参数配置" })
    @Permission(permissions.CREATE)
    async create(@Body() dto: ParamConfigDto): Promise<void> {
        await this.paramConfigService.create(dto);
    }

    @Get(":id")
    @ApiOperation({ summary: "查询参数配置信息" })
    @ApiResult({ type: ParamConfigEntity })
    @Permission(permissions.READ)
    async info(@IdParam() id: number): Promise<ParamConfigEntity> {
        return this.paramConfigService.findOne(id);
    }

    @Post(":id")
    @ApiOperation({ summary: "更新参数配置" })
    @Permission(permissions.UPDATE)
    async update(@IdParam() id: number, @Body() dto: ParamConfigDto): Promise<void> {
        await this.paramConfigService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "删除指定的参数配置" })
    @Permission(permissions.DELETE)
    async delete(@IdParam() id: number): Promise<void> {
        await this.paramConfigService.delete(id);
    }
}
