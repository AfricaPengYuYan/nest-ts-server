import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { INestApplication } from "@nestjs/common";

export function initSwagger(app: INestApplication, config: ConfigService) {
    const version = config.get<string>("system.versions");

    const options = new DocumentBuilder().setTitle("通用文档").setDescription("这个人很懒什么都没留下...").setVersion(version).build();
    const document = SwaggerModule.createDocument(app, options, {
        include: [],
    });
    SwaggerModule.setup("/api", app, document);
}
