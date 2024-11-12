import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { LessThan, Repository } from "typeorm";

import { paginate } from "~/helper/paginate";
import { CaptchaLogEntity } from "../entities/captcha-log.entity";
import { QueryCaptchaLogDto } from "../log.dto";

@Injectable()
export class CaptchaLogService {
    constructor(
        @InjectRepository(CaptchaLogEntity)
        private captchaLogRepository: Repository<CaptchaLogEntity>,
    ) { }

    async create(
        account: string,
        code: string,
        provider: "sms" | "email",
        uid?: number,
    ): Promise<void> {
        await this.captchaLogRepository.save({
            account,
            code,
            provider,
            userId: uid,
        });
    }

    async paginate({ page, pageSize }: QueryCaptchaLogDto) {
        const queryBuilder = await this.captchaLogRepository
            .createQueryBuilder("captcha_log")
            .orderBy("captcha_log.id", "DESC");

        return paginate<CaptchaLogEntity>(queryBuilder, {
            page,
            pageSize,
        });
    }

    async clearLog(): Promise<void> {
        await this.captchaLogRepository.clear();
    }

    async clearLogBeforeTime(time: Date): Promise<void> {
        await this.captchaLogRepository.delete({ createdTime: LessThan(time) });
    }
}
