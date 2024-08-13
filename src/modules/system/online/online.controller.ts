import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'

import { FastifyRequest } from 'fastify'

import { ApiResult } from '~/common/decorators/api-result.decorator'

import { AuthUser } from '~/common/decorators/auth-user.decorator'

import { Permission, definePermission } from '~/common/decorators/permission.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

import { KickDto } from './online.dto'
import { OnlineUserInfo } from './online.model'
import { OnlineService } from './online.service'

export const permissions = definePermission('system:online', ['list', 'kick'] as const)

@ApiTags('System - 在线用户模块')
@ApiSecurityAuth()
@ApiExtraModels(OnlineUserInfo)
@Controller('online')
export class OnlineController {
    constructor(private onlineService: OnlineService) { }

    @Get('list')
    @ApiOperation({ summary: '查询当前在线用户' })
    @ApiResult({ type: [OnlineUserInfo] })
    @Permission(permissions.LIST)
    async list(@Req() req: FastifyRequest): Promise<OnlineUserInfo[]> {
        return this.onlineService.listOnlineUser(req.accessToken)
    }

    @Post('kick')
    @ApiOperation({ summary: '下线指定在线用户' })
    @Permission(permissions.KICK)
    async kick(@Body() dto: KickDto, @AuthUser() user: IAuthUser): Promise<void> {
        await this.onlineService.kickUser(dto.tokenId, user)
    }
}
