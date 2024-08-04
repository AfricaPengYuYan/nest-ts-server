import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserRoleEntity } from "./user_role.entity";

@Injectable()
export class UserRoleService {
    constructor(
        @InjectRepository(UserRoleEntity)
        private readonly repository: Repository<UserRoleEntity>,
    ) {}
}
