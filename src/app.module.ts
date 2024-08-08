import { ClassSerializerInterceptor, Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler'
import type { FastifyRequest } from 'fastify'
import { ClsModule } from 'nestjs-cls'

import config from '~/config'
import { SharedModule } from '~/shared/shared.module'

import { HttpExceptionsFilter } from './common/filters/http.exception.filter'

import { IdempotenceInterceptor } from './common/interceptors/idempotence.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RbacGuard } from './modules/auth/guards/rbac.guard'


import { SystemModule } from './modules/system/system.module'

import { DatabaseModule } from './shared/database/database.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            // 指定多个 env 文件时，第一个优先级最高
            envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
            load: [...Object.values(config)],
        }),
        // 避免暴力请求，限制同一个接口 10 秒内不能超过 7 次请求
        ThrottlerModule.forRootAsync({
            useFactory: () => ({
                errorMessage: '当前操作过于频繁，请稍后再试！',
                throttlers: [
                    { ttl: seconds(10), limit: 7 },
                ],
            }),
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
        SharedModule,
        DatabaseModule,

        AuthModule,
        SystemModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: HttpExceptionsFilter },

        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
        { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
        { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
        { provide: APP_INTERCEPTOR, useClass: IdempotenceInterceptor },

        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RbacGuard },
        { provide: APP_GUARD, useClass: ThrottlerGuard },

    ],
})
export class AppModule {}
