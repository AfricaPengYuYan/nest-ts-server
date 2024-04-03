import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserRoleEntity } from "./user_role.entity";

@Injectable()
export class UserRoleService {
    constructor(
        @InjectRepository(UserRoleEntity)
        private readonly repository: Repository<UserRoleEntity>,
    ) {}
}
