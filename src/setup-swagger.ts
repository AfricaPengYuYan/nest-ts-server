import { INestApplication, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { API_SECURITY_AUTH } from "./common/decorators/swagger.decorator";
import { CommonEntity } from "./common/entity/common.entity";
import { Result, TreeResult } from "./common/models/result.model";
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from "./config";
import { Pagination } from "./helper/paginate/pagination";

export function setupSwagger(app: INestApplication, configService: ConfigService<ConfigKeyPaths>): void {
    const { name, port } = configService.get<IAppConfig>("app")!;
    const { enable, path } = configService.get<ISwaggerConfig>("swagger")!;

    // 如果未启用swagger则直接返回
    if (!enable)
        return;

    // 构建 Swagger 文档配置
    const documentBuilder = new DocumentBuilder()
        .setTitle(name)
        .setDescription(`${name} API document`)
        .setVersion("1.0");

    // 配置JWT认证
    documentBuilder.addSecurity(API_SECURITY_AUTH, {
        description: "输入令牌（Enter the token）",
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // 创建 Swagger 文档
    const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
        ignoreGlobalPrefix: false,
        extraModels: [CommonEntity, Result, Pagination, TreeResult], // 注册额外的模型
    });

    // 设置 Swagger UI
    SwaggerModule.setup(path, app, document, {
        swaggerOptions: {
            persistAuthorization: true, // 保持认证状态
        },
    });

    // started log
    const logger = new Logger("SwaggerModule");
    logger.log(`Document running on http://127.0.0.1:${port}/${path}`);
}
