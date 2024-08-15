import { Module, forwardRef } from "@nestjs/common";

import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

import { StorageModule } from "../storage/storage.module";

const services = [UploadService];

@Module({
    imports: [forwardRef(() => StorageModule)],
    controllers: [UploadController],
    providers: [...services],
    exports: [...services],
})
export class UploadModule {}
