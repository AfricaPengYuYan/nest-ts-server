import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Post,
    Put,
    Query,
    forwardRef,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { QueryRoleDto, RoleDto, UpdateRoleDto } from "./role.dto";

import { RoleInfo } from "./role.model";

import { RoleService } from "./role.service";

import { MenuService } from "../menu/menu.service";

import { ApiResult } from "~/common/decorators/api-result.decorator";
import { IdParam } from "~/common/decorators/id-param.decorator";
import { Permission, definePermission } from "~/common/decorators/permission.decorator";
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator";
import { UpdaterPipe } from "~/common/pipes/updater.pipe";
import { SseService } from "~/modules/sse/sse.service";
import { RoleEntity } from "~/modules/system/role/role.entity";

export const permissions = definePermission("system:role", {
    LIST: "list",
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
} as const);

@ApiTags("System - 角色模块")
@ApiSecurityAuth()
@Controller("role")
export class RoleController {
    constructor(
        private roleService: RoleService,
        private menuService: MenuService,
        @Inject(forwardRef(() => SseService))
        private sseService: SseService,
    ) { }

    @Get()
    @ApiOperation({ summary: "获取角色列表" })
    @ApiResult({ type: [RoleEntity], isPage: true })
    @Permission(permissions.LIST)
    async list(@Query() dto: QueryRoleDto) {
        return this.roleService.list(dto);
    }

    @Get(":id")
    @ApiOperation({ summary: "获取角色信息" })
    @ApiResult({ type: RoleInfo })
    @Permission(permissions.READ)
    async info(@IdParam() id: number) {
        return this.roleService.info(id);
    }

    @Post()
    @ApiOperation({ summary: "新增角色" })
    @Permission(permissions.CREATE)
    async create(@Body() dto: RoleDto): Promise<void> {
        await this.roleService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "更新角色" })
    @Permission(permissions.UPDATE)
    async update(@IdParam() id: number, @Body(UpdaterPipe) dto: UpdateRoleDto): Promise<void> {
        await this.roleService.update(id, dto);
        await this.menuService.refreshOnlineUserPerms(false);
        this.sseService.noticeClientToUpdateMenusByRoleIds([id]);
    }

    @Delete(":id")
    @ApiOperation({ summary: "删除角色" })
    @Permission(permissions.DELETE)
    async delete(@IdParam() id: number): Promise<void> {
        if (await this.roleService.checkUserByRoleId(id))
            throw new BadRequestException("该角色存在关联用户，无法删除");

        await this.roleService.delete(id);
        await this.menuService.refreshOnlineUserPerms(false);
        this.sseService.noticeClientToUpdateMenusByRoleIds([id]);
    }
}
