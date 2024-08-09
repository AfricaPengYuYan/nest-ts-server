import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, ISecurityConfig } from '~/config'
import { isDev } from '~/global/env'

import { RoleModule } from '~/modules/system/role/role.module'

import { UserModule } from '~/modules/system/user/user.module'

import { LogModule } from '../system/log/log.module'
import { MenuModule } from '../system/menu/menu.module'

import { AccessTokenEntity } from '../token/access-token.entity'
import { JwtStrategy } from '../token/jwt.strategy'
import { LocalStrategy } from '../token/local.strategy'
import { RefreshTokenEntity } from '../token/refresh-token.entity'
import { TokenService } from '../token/token.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccountController } from './controllers/account.controller'
import { CaptchaController } from './controllers/captcha.controller'
import { EmailController } from './controllers/email.controller'
import { CaptchaService } from './services/captcha.service'

const controllers = [
    AuthController,
    AccountController,
    CaptchaController,
    EmailController,
]
const providers = [AuthService, TokenService, CaptchaService]
const strategies = [LocalStrategy, JwtStrategy]

@Module({
    imports: [
        TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
                const { jwtSecret, jwtExprire }
          = configService.get<ISecurityConfig>('security')

                return {
                    secret: jwtSecret,
                    signOptions: {
                        expiresIn: `${jwtExprire}s`,
                    },
                    ignoreExpiration: isDev,
                }
            },
            inject: [ConfigService],
        }),
        UserModule,
        RoleModule,
        MenuModule,
        LogModule,
    ],
    controllers: [...controllers],
    providers: [...providers, ...strategies],
    exports: [TypeOrmModule, JwtModule, ...providers],
})
export class AuthModule {}
