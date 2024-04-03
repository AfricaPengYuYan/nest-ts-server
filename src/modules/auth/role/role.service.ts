import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RoleEntity } from "./role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRoleService } from "../user_role/user_role.service";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly repository: Repository<RoleEntity>,
        private readonly userRoleService: UserRoleService,
    ) {}
}
