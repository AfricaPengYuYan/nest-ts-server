import { Module } from "@nestjs/common";

import { RouterModule } from "@nestjs/core";

import { NetDiskManageController } from "./manager/manage.controller";
import { NetDiskManageService } from "./manager/manage.service";
import { NetDiskOverviewController } from "./overview/overview.controller";
import { NetDiskOverviewService } from "./overview/overview.service";

import { UserModule } from "~/modules/system/user/user.module";

@Module({
    imports: [UserModule, RouterModule.register([
        {
            path: "netdisk",
            module: NetdiskModule,
        },
    ])],
    controllers: [NetDiskManageController, NetDiskOverviewController],
    providers: [NetDiskManageService, NetDiskOverviewService],
})
export class NetdiskModule {}
