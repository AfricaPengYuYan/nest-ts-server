import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleDeptEntity } from "./role_dept.entity";

@Injectable()
export class RoleDeptService {
    constructor(
        @InjectRepository(RoleDeptEntity)
        private readonly repository: Repository<RoleDeptEntity>,
    ) {}
}
