import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleMenuEntity } from "./role_menu.entity";

@Injectable()
export class RoleMenuService {
    constructor(
        @InjectRepository(RoleMenuEntity)
        private readonly repository: Repository<RoleMenuEntity>,
    ) {}
}
