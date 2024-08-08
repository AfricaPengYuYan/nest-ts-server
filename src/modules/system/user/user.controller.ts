import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { definePermission } from '~/common/decorators/permission.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

export const permissions = definePermission('system:user', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',

    PASSWORD_UPDATE: 'password:update',
    PASSWORD_RESET: 'pass:reset',
} as const)

@ApiTags('System - 用户模块')
@ApiSecurityAuth()
@Controller('user')
export class UserController {
    constructor(

    ) {}
}
