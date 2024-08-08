import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'

import Redis from 'ioredis'
import { isEmpty } from 'lodash'

import { ApiException } from '~/common/exceptions/api.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { genCaptchaImgKey } from '~/helper/genRedisKey'

@Injectable()
export class CaptchaService {
    constructor(
    @InjectRedis() private redis: Redis,

    ) {}

    /**
     * 校验图片验证码
     */
    async checkImgCaptcha(id: string, code: string): Promise<void> {
        const result = await this.redis.get(genCaptchaImgKey(id))
        if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase())
            throw new ApiException(ErrorEnum.INVALID_VERIFICATION_CODE)

        // 校验成功后移除验证码
        await this.redis.del(genCaptchaImgKey(id))
    }
}
