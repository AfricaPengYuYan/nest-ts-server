import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MenuModule } from '../menu/menu.module'

import { RoleModule } from '../role/role.module'

import { UserController } from './user.controller'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

const providers = [UserService]

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        RoleModule,
        MenuModule,
    ],
    controllers: [UserController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class UserModule {}
