import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { ApiResult } from "~/common/decorators/api-result.decorator";
import { IdParam } from "~/common/decorators/id-param.decorator";
import { definePermission, Permission } from "~/common/decorators/permission.decorator";
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator";
import { MenuService } from "~/modules/system/menu/menu.service";

import { EditPasswordDto, QueryUserDto, UpdateUserDto, UserDto } from "./user.dto";

import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

export const permissions = definePermission("system:user", {
    LIST: "list",
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
    PASSWORD_UPDATE: "password:update",
    PASSWORD_RESET: "pass:reset",
});

@ApiTags("System - 用户模块")
@ApiSecurityAuth()
@Controller("user")
export class UserController {
    constructor(
        private userService: UserService,
        private menuService: MenuService,
    ) { }

    @Get()
    @ApiOperation({ summary: "获取用户列表" })
    @ApiResult({ type: [UserEntity], isPage: true })
    @Permission(permissions.LIST)
    async list(@Query() dto: QueryUserDto) {
        return this.userService.list(dto);
    }

    @Get(":id")
    @ApiOperation({ summary: "查询用户" })
    @Permission(permissions.READ)
    async read(@IdParam() id: number) {
        return this.userService.info(id);
    }

    @Post()
    @ApiOperation({ summary: "新增用户" })
    @Permission(permissions.CREATE)
    async create(@Body() dto: UserDto): Promise<void> {
        await this.userService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "更新用户" })
    @Permission(permissions.UPDATE)
    async update(@IdParam() id: number, @Body() dto: UpdateUserDto): Promise<void> {
        await this.userService.update(id, dto);
        await this.menuService.refreshPerms(id);
    }

    @Delete(":id")
    @ApiOperation({ summary: "删除用户" })
    @ApiParam({ name: "id", type: String, schema: { oneOf: [{ type: "string" }, { type: "number" }] } })
    @Permission(permissions.DELETE)
    async delete(@Param("id", new ParseArrayPipe({ items: Number, separator: "," })) ids: number[]): Promise<void> {
        await this.userService.delete(ids);
        await this.userService.multiForbidden(ids);
    }

    @Post(":id/password")
    @ApiOperation({ summary: "更改用户密码" })
    @Permission(permissions.PASSWORD_UPDATE)
    async password(@IdParam() id: number, @Body() dto: EditPasswordDto): Promise<void> {
        await this.userService.forceUpdatePassword(id, dto.password);
    }
}
