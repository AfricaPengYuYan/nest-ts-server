import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard'

@ApiTags('Account - 账户模块')
@ApiSecurityAuth()
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
    constructor() {}
}
