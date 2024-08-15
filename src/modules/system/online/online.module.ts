import { Module, forwardRef } from "@nestjs/common";

import { OnlineController } from "./online.controller";
import { OnlineService } from "./online.service";

import { AuthModule } from "~/modules/auth/auth.module";

import { SseModule } from "~/modules/sse/sse.module";

import { UserModule } from "~/modules/system/user/user.module";

const providers = [OnlineService];

@Module({
    imports: [
        UserModule,
        AuthModule,
        forwardRef(() => SseModule),
    ],
    controllers: [OnlineController],
    providers,
    exports: [...providers],
})
export class OnlineModule { }
