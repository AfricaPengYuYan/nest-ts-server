import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule, seconds } from '@nestjs/throttler'

import { isDev } from '~/global/env'

import { LoggerModule } from './logger/logger.module'
import { RedisModule } from './redis/redis.module'

@Global()
@Module({
    imports: [
        // logger
        LoggerModule.forRoot(),
        // http
        HttpModule,
        // schedule
        ScheduleModule.forRoot(),
        // 避免暴力请求，限制同一个接口 10 秒内不能超过 7 次请求
        ThrottlerModule.forRootAsync({
            useFactory: () => ({
                errorMessage: '当前操作过于频繁，请稍后再试！',
                throttlers: [{ ttl: seconds(10), limit: 7 }],
            }),
        }),
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 20,
            verboseMemoryLeak: isDev,
            ignoreErrors: false,
        }),
        // redis
        RedisModule,
    ],
    exports: [HttpModule, RedisModule],
})
export class SharedModule {}
