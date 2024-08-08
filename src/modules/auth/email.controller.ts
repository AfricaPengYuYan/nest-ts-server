import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ThrottlerGuard } from '@nestjs/throttler'

@ApiTags('Auth - 认证模块')
@UseGuards(ThrottlerGuard)
@Controller('auth/email')
export class EmailController {
    constructor() {}
}
