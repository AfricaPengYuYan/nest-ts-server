import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'

import { In, Repository } from 'typeorm'

import { ROOT_ROLE_ID } from '~/common/constants/system.constant'

import { RoleEntity } from './role.entity'

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly repository: Repository<RoleEntity>,
    ) {}

    async getRoleIdsByUser(id: number): Promise<number[]> {
        const roles = await this.repository.find({
            where: {
                users: { id },
            },
        })

        if (!isEmpty(roles))
            return roles.map(r => r.id)

        return []
    }

    async getRoleValues(ids: number[]): Promise<string[]> {
        return (
            await this.repository.findBy({
                id: In(ids),
            })
        ).map(r => r.value)
    }

    hasAdminRole(rids: number[]): boolean {
        return rids.includes(ROOT_ROLE_ID)
    }
}
