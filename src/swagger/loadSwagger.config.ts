import { ConfigurationKeyPaths } from "@/config/configuration";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function initSwagger(app: INestApplication) {
    const configService: ConfigService<ConfigurationKeyPaths> = app.get(ConfigService);

    const options = new DocumentBuilder().setTitle("通用文档").setDescription("这个人很懒什么都没留下...").build();
    const document = SwaggerModule.createDocument(app, options, {
        include: [],
    });
    SwaggerModule.setup("/api", app, document);
}
