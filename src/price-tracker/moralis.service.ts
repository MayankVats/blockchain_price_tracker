import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import Moralis from 'moralis';
import { ChainRepository } from './repositories/chain.repository';
import { PriceRepository } from './repositories/prices.repository';
import { AlertRepository } from './repositories/alert.repository';
import { LessThanOrEqual } from 'typeorm';
import { MailServiceService } from 'src/mail-service/mail-service.service';

@Injectable()
export class MoralisService {
  private moralisApiKey = '';

  constructor(
    private readonly configService: ConfigService,
    private readonly chainRepository: ChainRepository,
    private readonly priceReposity: PriceRepository,
    private readonly alertRepository: AlertRepository,
    private readonly mailService: MailServiceService,
  ) {
    this.moralisApiKey = this.configService.get<string>('MORALIS_API_KEY');
    this.initMoralis();
  }

  async initMoralis() {
    await Moralis.start({
      apiKey: this.moralisApiKey,
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchPrices() {
    const chains = await this.chainRepository.fetchAllChains();

    chains.forEach(async (chain) => {
      try {
        // Fetch token price for Ethereum and Polygon
        const price = await this.getTokenPrice(chain.hexId, chain.tokenId);

        // Save the price in DB
        const priceEntity = this.priceReposity.create({
          chain,
          price,
        });
        await this.priceReposity.save(priceEntity);

        // Fetch all the alerts equal to or above threshold price
        const alerts = await this.alertRepository.find({
          where: {
            chain,
            thresholdPrice: LessThanOrEqual(price),
            isActive: true,
          },
        });

        // Send email
        alerts.forEach(async (alert) => {
          console.log(
            `Price for ${chain.name} is now $${price} which is ${price - alert.thresholdPrice} above threshold.`,
          );

          await this.mailService.sendEmail(
            alert.email,
            `${chain.name} Price Alert!`,
            `Price for ${chain.name} is now $${price} which is ${price - alert.thresholdPrice} above threshold.`,
          );

          alert.isActive = false;
          await this.alertRepository.save(alert);
        });

        const priceData = await this.priceReposity.query(
          'SELECT price FROM prices WHERE "recordedAt" = (SELECT MAX("recordedAt") FROM prices WHERE "recordedAt" <= NOW() - INTERVAL \'1 hour\' AND "chainId" = $1);',
          [chain.id],
        );

        if (priceData && priceData.length > 0) {
          const priceOneHourAgo = priceData[0]?.price;

          console.log({ price, priceOneHourAgo });

          if (price >= Number(priceOneHourAgo) * 1.03) {
            await this.mailService.sendEmail(
              'hyperhire_assignment@hyperhire.in',
              `${chain.name} Price Alert!`,
              `Price for ${chain.name} is now $${price} which is more then 3% increase in price one hour ago.`,
            );
            console.log('Current price is 3% more than the price one hour ago');
          }
        }

        console.log(`Price for ${chain.name} is now $${price}`);
      } catch (error) {
        console.error('Error fetching or logging price', error);
      }
    });
  }

  async getTokenPrice(chain: string, tokenAddress: string) {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain,
        address: tokenAddress,
      });

      const { usdPrice } = response.raw;

      // TODO: Fetch price every 5 minutes

      // TODO: Check if price increased by 3%, then send an email

      return usdPrice;
    } catch (e) {
      console.error(e);
    }
  }
}

/*

{
  tokenName: 'Wrapped Matic',
  tokenSymbol: 'WMATIC',
  tokenLogo: 'https://logo.moralis.io/0x89_0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270_d322c367b22146fa6d9f6434af8614be',
  tokenDecimals: '18',
  nativePrice: {
    value: '1000000000000000049',
    decimals: 18,
    name: 'Polygon Ecosystem Token',
    symbol: 'POL',
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  },
  usdPrice: 0.43271276860266744,
  usdPriceFormatted: '0.432712768602667461',
  exchangeName: 'Uniswap v3',
  exchangeAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  tokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  priceLastChangedAtBlock: '64550816',
  blockTimestamp: '1732183878000',
  possibleSpam: false,
  verifiedContract: true,
  pairAddress: '0x9b08288c3be4f62bbf8d1c20ac9c5e6f9467d8b7',
  pairTotalLiquidityUsd: '1052160.72',
  securityScore: 92
}
{
  tokenName: 'Wrapped Ether',
  tokenSymbol: 'WETH',
  tokenLogo: 'https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_996ca17c00e6665189c55f0101abba12',
  tokenDecimals: '18',
  nativePrice: {
    value: '999999999999999052',
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  },
  usdPrice: 3132.816221851165,
  usdPriceFormatted: '3132.816221851165429927',
  exchangeName: 'Uniswap v3',
  exchangeAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  priceLastChangedAtBlock: '21235425',
  blockTimestamp: '1732183883000',
  possibleSpam: false,
  verifiedContract: true,
  pairAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  pairTotalLiquidityUsd: '136955661.04',
  securityScore: 92
}

*/
