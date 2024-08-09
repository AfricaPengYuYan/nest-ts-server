import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '~/modules/system/user/user.module'

import { RoleModule } from '../role/role.module'

import { DeptController } from './dept.controller'
import { DeptEntity } from './dept.entity'
import { DeptService } from './dept.service'

const services = [DeptService]

@Module({
    imports: [TypeOrmModule.forFeature([DeptEntity]), UserModule, RoleModule],
    controllers: [DeptController],
    providers: [...services],
    exports: [TypeOrmModule, ...services],
})
export class DeptModule {}
