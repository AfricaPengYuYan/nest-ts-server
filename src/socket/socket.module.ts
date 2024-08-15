import { Module, Provider, forwardRef } from "@nestjs/common";

import { AdminEventsGateway } from "./events/admin.gateway";
import { WebEventsGateway } from "./events/web.gateway";

import { AuthModule } from "../modules/auth/auth.module";
import { SystemModule } from "../modules/system/system.module";

const providers: Provider[] = [AdminEventsGateway, WebEventsGateway];

@Module({
    imports: [forwardRef(() => SystemModule), AuthModule],
    providers,
    exports: [...providers],
})
export class SocketModule {}
