import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleService } from "../role/role.service";
import { MenuService } from "../menu/menu.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private readonly roleService: RoleService,
        private readonly menuService: MenuService,
        private readonly configService: ConfigService,
    ) {}
}
