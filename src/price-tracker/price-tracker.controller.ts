import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PriceTrackerService } from './price-tracker.service';
import { SetAlertInput } from './dtos/set-alert.input';
import { GenericResponse } from './interfaces/generic-response.interface';

@Controller('price-tracker')
export class PriceTrackerController {
  constructor(private readonly priceTrackerService: PriceTrackerService) {}

  @Get('prices')
  async getPrices(@Query('chain') chain: string) {
    return this.priceTrackerService.getPrices(chain);
  }

  @Post('set-alert')
  async setAlert(
    @Body() setAlertInput: SetAlertInput,
  ): Promise<GenericResponse> {
    return this.priceTrackerService.setAlert(setAlertInput);
  }
}
