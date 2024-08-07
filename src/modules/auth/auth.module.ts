import { Module, forwardRef } from '@nestjs/common'

import { UserModule } from '../system/user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    imports: [forwardRef(() => UserModule)],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
