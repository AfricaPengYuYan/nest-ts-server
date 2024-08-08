import {
    Controller,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { definePermission } from '~/common/decorators/permission.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

export const permissions = definePermission('system:role', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
} as const)

@ApiTags('System - 角色模块')
@ApiSecurityAuth()
@Controller('role')
export class RoleController {
    constructor() {}
}
