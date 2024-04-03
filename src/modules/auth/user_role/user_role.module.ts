import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRoleService } from "./user_role.service";
import { UserRoleEntity } from "./user_role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserRoleEntity])],
    controllers: [],
    providers: [UserRoleService],
    exports: [UserRoleService],
})
export class UserRoleModule {}
