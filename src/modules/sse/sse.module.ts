import { Module } from "@nestjs/common";

import { SseController } from "./sse.controller";
import { SseService } from "./sse.service";

import { OnlineModule } from "../system/online/online.module";

@Module({
    imports: [OnlineModule],
    controllers: [SseController],
    providers: [SseService],
    exports: [SseService],
})
export class SseModule {}
