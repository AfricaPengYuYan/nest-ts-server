import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRoleEntity } from "./user_role.entity";
import { UserRoleService } from "./user_role.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRoleEntity])],
    controllers: [],
    providers: [UserRoleService],
    exports: [UserRoleService],
})
export class UserRoleModule {}
