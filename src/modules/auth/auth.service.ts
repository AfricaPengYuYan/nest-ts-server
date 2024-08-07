import { InjectRedis } from '@liaoliaots/nestjs-redis'

import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

import { genAuthPVKey, genAuthPermKey, genAuthTokenKey } from '~/helper/genRedisKey'

import { MenuService } from '../system/menu/menu.service'

@Injectable()
export class AuthService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
        private menuService: MenuService,
    ) {}

    async getPasswordVersionByUid(uid: number): Promise<string> {
        return this.redis.get(genAuthPVKey(uid))
    }

    async getTokenByUid(uid: number): Promise<string> {
        return this.redis.get(genAuthTokenKey(uid))
    }

    async getPermissionsCache(uid: number): Promise<string[]> {
        const permissionString = await this.redis.get(genAuthPermKey(uid))
        return permissionString ? JSON.parse(permissionString) : []
    }

    async getPermissions(uid: number): Promise<string[]> {
        return this.menuService.getPermissions(uid)
    }
}
