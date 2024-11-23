import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "~/modules/system/user/user.module";
import { CaptchaLogEntity } from "./entity/captcha-log.entity";
import { LoginLogEntity } from "./entity/login-log.entity";
import { TaskLogEntity } from "./entity/task-log.entity";
import { LogController } from "./log.controller";
import { CaptchaLogService } from "./services/captcha-log.service";
import { LoginLogService } from "./services/login-log.service";
import { TaskLogService } from "./services/task-log.service";

const providers = [LoginLogService, TaskLogService, CaptchaLogService];

@Module({
    imports: [
        TypeOrmModule.forFeature([LoginLogEntity, CaptchaLogEntity, TaskLogEntity]),
        UserModule,
    ],
    controllers: [LogController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class LogModule {}
