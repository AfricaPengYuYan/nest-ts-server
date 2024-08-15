import { BadRequestException, Injectable } from "@nestjs/common";

import { Mission } from "../mission.decorator";

import { LoggerService } from "~/shared/logger/logger.service";
import { MailerService } from "~/shared/mailer/mailer.service";

/**
 * Api接口请求类型任务
 */
@Injectable()
@Mission()
export class EmailJob {
    constructor(
        private readonly emailService: MailerService,
        private readonly logger: LoggerService,
    ) { }

    async send(config: any): Promise<void> {
        if (config) {
            const { to, subject, content } = config;
            const result = await this.emailService.send(to, subject, content);
            this.logger.log(result, EmailJob.name);
        }
        else {
            throw new BadRequestException("Email send job param is empty");
        }
    }
}
