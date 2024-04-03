import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: "jwt",
            session: false,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>("jwt.secretKey"),
                    signOptions: {
                        expiresIn: configService.get<string>("jwt.signOptions.expiresIn"),
                    },
                };
            },
            inject: [ConfigService],
        }),
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
