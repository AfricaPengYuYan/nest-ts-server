import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Redis } from 'ioredis'
import { isEmpty } from 'lodash'
import { Repository } from 'typeorm'

import { genAuthPVKey, genAuthPermKey, genAuthTokenKey, genOnlineUserKey } from '~/helper/genRedisKey'

import { AccessTokenEntity } from '~/modules/auth/token/access-token.entity'

import { md5 } from '~/utils'

import { UserStatus } from '../../../common/constants/user.constant'

import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRedis()
        private readonly redis: Redis,
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) { }

    async forbidden(uid: number, accessToken?: string): Promise<void> {
        await this.redis.del(genAuthPVKey(uid))
        await this.redis.del(genAuthTokenKey(uid))
        await this.redis.del(genAuthPermKey(uid))
        if (accessToken) {
            const token = await AccessTokenEntity.findOne({
                where: { value: accessToken },
            })
            this.redis.del(genOnlineUserKey(token.id))
        }
    }

    async findUserByUserName(username: string): Promise<UserEntity | undefined> {
        return this.repository
            .createQueryBuilder('user')
            .where({
                username,
                status: UserStatus.Enabled,
            })
            .getOne()
    }

    async upgradePasswordV(id: number): Promise<void> {
        // admin:passwordVersion:${param.id}
        const v = await this.redis.get(genAuthPVKey(id))
        if (!isEmpty(v))
            await this.redis.set(genAuthPVKey(id), Number.parseInt(v) + 1)
    }

    async forceUpdatePassword(uid: number, password: string): Promise<void> {
        const user = await this.repository.findOneBy({ id: uid })

        const newPassword = md5(`${password}${user.psalt}`)
        await this.repository.update({ id: uid }, { password: newPassword })
        await this.upgradePasswordV(user.id)
    }
}
