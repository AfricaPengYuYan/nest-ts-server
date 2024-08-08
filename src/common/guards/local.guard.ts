import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthStrategy } from '../constants/auth.constant'

@Injectable()
export class LocalGuard extends AuthGuard(AuthStrategy.LOCAL) {
    async canActivate(context: ExecutionContext) {
        return true
    }
}
