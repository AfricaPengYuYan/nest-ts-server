import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { StorageDeleteDto, StoragePageDto } from "./storage.dto";
import { StorageInfo } from "./storage.modal";

import { StorageService } from "./storage.service";

import { ApiResult } from "~/common/decorators/api-result.decorator";
import { Permission, definePermission } from "~/common/decorators/permission.decorator";
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator";

import { Pagination } from "~/helper/paginate/pagination";

export const permissions = definePermission("tool:storage", {
    LIST: "list",
    DELETE: "delete",
} as const);

@ApiTags("Tools - 存储模块")
@ApiSecurityAuth()
@Controller("storage")
export class StorageController {
    constructor(private storageService: StorageService) { }

    @Get("list")
    @ApiOperation({ summary: "获取本地存储列表" })
    @ApiResult({ type: [StorageInfo], isPage: true })
    @Permission(permissions.LIST)
    async list(@Query() dto: StoragePageDto): Promise<Pagination<StorageInfo>> {
        return this.storageService.list(dto);
    }

    @ApiOperation({ summary: "删除文件" })
    @Post("delete")
    @Permission(permissions.DELETE)
    async delete(@Body() dto: StorageDeleteDto): Promise<void> {
        await this.storageService.delete(dto.ids);
    }
}
