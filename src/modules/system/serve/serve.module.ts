import { Module, forwardRef } from "@nestjs/common";

import { ServeController } from "./serve.controller";
import { ServeService } from "./serve.service";

import { SystemModule } from "../system.module";

const providers = [ServeService];

@Module({
    imports: [forwardRef(() => SystemModule)],
    controllers: [ServeController],
    providers: [...providers],
    exports: [...providers],
})
export class ServeModule {}
