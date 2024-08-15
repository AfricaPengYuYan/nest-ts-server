import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";

import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard";

import { AuthService } from "../auth.service";

import { AccountMenus, AccountUpdateDto } from "../dto/account.dto";

import { AllowAnon } from "~/common/decorators/allow-anon.decorator";
import { ApiResult } from "~/common/decorators/api-result.decorator";

import { AuthUser } from "~/common/decorators/auth-user.decorator";
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator";

import { UpdatePasswordDto } from "~/modules/system/user/user.dto";
import { AccountInfo } from "~/modules/system/user/user.model";
import { UserService } from "~/modules/system/user/user.service";

@ApiTags("Account - 账户模块")
@ApiSecurityAuth()
@ApiExtraModels(AccountInfo)
@UseGuards(JwtAuthGuard)
@Controller("account")
export class AccountController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) { }

    @Get("profile")
    @ApiOperation({ summary: "获取账户资料" })
    @ApiResult({ type: AccountInfo })
    @AllowAnon()
    async profile(@AuthUser() user: IAuthUser): Promise<AccountInfo> {
        return this.userService.getAccountInfo(user.uid);
    }

    @Get("logout")
    @ApiOperation({ summary: "账户登出" })
    @AllowAnon()
    async logout(@AuthUser() user: IAuthUser, @Req() req: FastifyRequest): Promise<void> {
        await this.authService.clearLoginStatus(user, req.accessToken);
    }

    @Get("menus")
    @ApiOperation({ summary: "获取菜单列表" })
    @ApiResult({ type: [AccountMenus] })
    @AllowAnon()
    async menu(@AuthUser() user: IAuthUser) {
        return this.authService.getMenus(user.uid);
    }

    @Get("permissions")
    @ApiOperation({ summary: "获取权限列表" })
    @ApiResult({ type: [String] })
    @AllowAnon()
    async permissions(@AuthUser() user: IAuthUser): Promise<string[]> {
        return this.authService.getPermissions(user.uid);
    }

    @Put("update")
    @ApiOperation({ summary: "更改账户资料" })
    @AllowAnon()
    async update(
        @AuthUser() user: IAuthUser, @Body()
        dto: AccountUpdateDto,
    ): Promise<void> {
        await this.userService.updateAccountInfo(user.uid, dto);
    }

    @Post("password")
    @ApiOperation({ summary: "更改账户密码" })
    @AllowAnon()
    async password(
        @AuthUser() user: IAuthUser, @Body()
        dto: UpdatePasswordDto,
    ): Promise<void> {
        await this.userService.updatePassword(user.uid, dto);
    }
}
