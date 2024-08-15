import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleController } from "./role.controller";
import { RoleEntity } from "./role.entity";
import { RoleService } from "./role.service";

import { MenuModule } from "../menu/menu.module";

import { SseService } from "~/modules/sse/sse.service";

const providers = [RoleService, SseService];

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity]),
        forwardRef(() => MenuModule),
    ],
    controllers: [RoleController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class RoleModule {}
