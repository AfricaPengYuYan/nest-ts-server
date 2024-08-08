import {
    Controller,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { definePermission } from '~/common/decorators/permission.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

export const permissions = definePermission('system:menu', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
} as const)

@ApiTags('System - 菜单权限模块')
@ApiSecurityAuth()
@Controller('menu')
export class MenuController {
    constructor() {}
}
