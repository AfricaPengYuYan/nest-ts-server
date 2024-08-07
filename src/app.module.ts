import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import type { FastifyRequest } from 'fastify'
import { ClsModule } from 'nestjs-cls'
import { DataSource, LoggerOptions } from 'typeorm'

import { HttpExceptionFilter } from './common/filters/http.exception.filter'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { RbacGuard } from './common/guards/rbac.guard'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import config, { ConfigKeyPaths, IDatabaseConfig } from './config'
import { env } from './global/env'
import { AuthModule } from './modules/auth/auth.module'
import { MenuModule } from './modules/system/menu/menu.module'
import { RoleModule } from './modules/system/role/role.module'
import { UserModule } from './modules/system/user/user.module'
import { TypeORMLogger } from './shared/database/typeorm-logger'
import { SharedModule } from './shared/shared.module'

@Module({
    imports: [
        // 配置模块
        ConfigModule.forRoot({
            ignoreEnvFile: false,
            isGlobal: true,
            load: [...Object.values(config)],
            envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        }),
        // 使用MySql
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
                let loggerOptions: LoggerOptions = env('DB_LOGGING') as 'all'

                try {
                    // 解析成 js 数组 ['error']
                    loggerOptions = JSON.parse(loggerOptions)
                }
                catch (e) {
                    // ignore
                }

                return {
                    ...configService.get<IDatabaseConfig>('database'),
                    autoLoadEntities: true,
                    logging: loggerOptions,
                    logger: new TypeORMLogger(loggerOptions),
                }
            },
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize()
                return dataSource
            },
        }),
        // 启用 CLS 上下文
        ClsModule.forRoot({
            global: true,
            // https://github.com/Papooch/nestjs-cls/issues/92
            interceptor: {
                mount: true,
                setup: (cls, context) => {
                    const req = context.switchToHttp().getRequest<FastifyRequest<{ Params: { id?: string } }>>()
                    if (req.params?.id && req.body) {
                        // 供自定义参数验证器(UniqueConstraint)使用
                        cls.set('operateId', Number.parseInt(req.params.id))
                    }
                },
            },
        }),

        // 共享模块
        SharedModule,

        // RBAC
        UserModule,
        RoleModule,
        MenuModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        { provide: APP_FILTER, useClass: HttpExceptionFilter },

        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
        { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RbacGuard },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule {}
