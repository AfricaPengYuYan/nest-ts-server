import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MenuModule } from '~/modules/system/menu/menu.module'
import { ParamConfigModule } from '~/modules/system/param-config/param-config.module'
import { RoleModule } from '~/modules/system/role/role.module'

import { UserController } from './user.controller'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

const providers = [UserService]

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        RoleModule,
        MenuModule,
        ParamConfigModule,
    ],
    controllers: [UserController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class UserModule { }
