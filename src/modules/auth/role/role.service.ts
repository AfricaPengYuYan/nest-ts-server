import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRoleService } from "../user_role/user_role.service";
import { RoleEntity } from "./role.entity";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly repository: Repository<RoleEntity>,
        private readonly userRoleService: UserRoleService,
    ) {}
}
