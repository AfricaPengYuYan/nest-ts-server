import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuModule } from "../menu/menu.module";
import { RoleModule } from "../role/role.module";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => RoleModule), forwardRef(() => MenuModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
