import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/auth/user/user.module";
import { UserRoleModule } from "./modules/auth/user_role/user_role.module";
import { RoleModule } from "./modules/auth/role/role.module";
import { RoleMenuModule } from "./modules/auth/role_menu/role_menu.module";
import { RoleDeptModule } from "./modules/auth/role_dept/role_dept.module";
import { MenuModule } from "./modules/auth/menu/menu.module";
import { AuthModule } from "./modules/auth/auth.module";
import { loadConfig } from "./config/load.config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        // 配置模块
        ConfigModule.forRoot({
            ignoreEnvFile: false,
            isGlobal: true,
            load: [loadConfig],
        }),
        // 使用MySql
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                return { ...config.get("mysql") };
            },
            inject: [ConfigService],
        }),
        // RBAC
        UserModule,
        UserRoleModule,
        RoleModule,
        RoleMenuModule,
        RoleDeptModule,
        MenuModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
