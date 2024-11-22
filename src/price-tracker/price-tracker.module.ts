import { Module } from '@nestjs/common';
import { PriceTrackerController } from './price-tracker.controller';
import { PriceTrackerService } from './price-tracker.service';
import { MoralisService } from './moralis.service';
import { Chain } from './entities/chains.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainRepository } from './repositories/chain.repository';
import { PriceRepository } from './repositories/prices.repository';
import { AlertRepository } from './repositories/alert.repository';
import { MailServiceService } from 'src/mail-service/mail-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chain])],
  controllers: [PriceTrackerController],
  providers: [
    PriceTrackerService,
    MoralisService,
    ChainRepository,
    PriceRepository,
    AlertRepository,
    MailServiceService,
  ],
  exports: [ChainRepository, PriceRepository, AlertRepository],
})
export class PriceTrackerModule {}
