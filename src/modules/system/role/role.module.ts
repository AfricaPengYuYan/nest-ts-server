import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';
import { UserRoleModule } from '../user_role/user_role.module';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity]), forwardRef(() => UserRoleModule)],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
