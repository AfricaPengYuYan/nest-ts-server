import { JwtService } from "@nestjs/jwt";
import {
    GatewayMetadata,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

import { Server } from "socket.io";

import { createAuthGateway } from "../shared/auth.gateway";

import { TokenService } from "~/modules/token/token.service";
import { CacheService } from "~/shared/redis/cache.service";

const AuthGateway = createAuthGateway({ namespace: "web" });
@WebSocketGateway<GatewayMetadata>({ namespace: "web" })
export class WebEventsGateway
    extends AuthGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        protected readonly jwtService: JwtService,
        protected readonly tokenService: TokenService,
        private readonly cacheService: CacheService,
    ) {
        super(jwtService, tokenService, cacheService);
    }

    @WebSocketServer()
    protected _server: Server;

    get server() {
        return this._server;
    }
}
