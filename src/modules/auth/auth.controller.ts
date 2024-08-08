import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Public } from '../../common/decorators/public.decorator'
import { LocalGuard } from '../../common/guards/local.guard'

@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
    constructor() {}
}
