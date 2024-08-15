import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DeptController } from "./dept.controller";
import { DeptEntity } from "./dept.entity";
import { DeptService } from "./dept.service";

import { RoleModule } from "../role/role.module";

import { UserModule } from "~/modules/system/user/user.module";

const services = [DeptService];

@Module({
    imports: [TypeOrmModule.forFeature([DeptEntity]), UserModule, RoleModule],
    controllers: [DeptController],
    providers: [...services],
    exports: [TypeOrmModule, ...services],
})
export class DeptModule {}
