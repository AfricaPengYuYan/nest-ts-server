import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRoleModule } from "../user_role/user_role.module";
import { RoleController } from "./role.controller";
import { RoleEntity } from "./role.entity";
import { RoleService } from "./role.service";

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity]), forwardRef(() => UserRoleModule)],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
