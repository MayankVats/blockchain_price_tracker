import { Module } from '@nestjs/common';
import { MailServiceService } from './mail-service.service';

@Module({
  providers: [MailServiceService],
})
export class MailServiceModule {}
