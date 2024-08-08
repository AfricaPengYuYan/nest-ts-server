import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, ISecurityConfig } from '~/config'
import { isDev } from '~/global/env'

import { MenuModule } from '../system/menu/menu.module'
import { RoleModule } from '../system/role/role.module'
import { UserModule } from '../system/user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenEntity } from './token/access-token.entity'
import { JwtStrategy } from './token/jwt.strategy'
import { LocalStrategy } from './token/local.strategy'
import { RefreshTokenEntity } from './token/refresh-token.entity'

import { TokenService } from './token/token.service'

const controllers = [
    AuthController,

]
const providers = [AuthService, TokenService]
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
    ],
    controllers: [...controllers],
    providers: [...providers, ...strategies],
    exports: [TypeOrmModule, JwtModule, ...providers],
})
export class AuthModule {}
