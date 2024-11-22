import { Injectable } from '@nestjs/common';
import { ChainRepository } from './repositories/chain.repository';
import { PriceRepository } from './repositories/prices.repository';
import { AlertRepository } from './repositories/alert.repository';
import { SetAlertInput } from './dtos/set-alert.input';
import { GenericResponse } from './interfaces/generic-response.interface';

@Injectable()
export class PriceTrackerService {
  constructor(
    private readonly chainRespository: ChainRepository,
    private readonly priceRepository: PriceRepository,
    private readonly alertRepository: AlertRepository,
  ) {}

  async getPrices(chain: string) {
    const chainData = await this.chainRespository.findOne({
      where: { hexId: chain },
    });

    if (!chainData) {
      throw new Error('Invalid Chain Id');
    }

    const hourlyAveragePrice = await this.priceRepository.query(
      'SELECT DATE_TRUNC(\'hour\', p."recordedAt") AS hour, AVG(p.price) AS averagePrice FROM prices p WHERE p."chainId" = $1 AND p."recordedAt" >= NOW() - INTERVAL \'24 hours\' GROUP BY DATE_TRUNC(\'hour\', p."recordedAt") ORDER BY hour ASC;',
      [chainData.id],
    );
    return hourlyAveragePrice;
  }

  async setAlert(setAlertInput: SetAlertInput): Promise<GenericResponse> {
    const { chain, dollar, email } = setAlertInput;

    const chainData = await this.chainRespository.findOne({
      where: { hexId: chain },
    });

    if (!chainData) {
      throw new Error('Invalid Chain Id');
    }

    const alertEntity = this.alertRepository.create({
      chain: chainData,
      thresholdPrice: Number(dollar),
      email: email,
    });

    await this.alertRepository.save(alertEntity);

    return { message: 'Alert created successfully', success: true };
  }
}
