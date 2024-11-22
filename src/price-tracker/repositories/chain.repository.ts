import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Chain } from '../entities/chains.entity';

@Injectable()
export class ChainRepository extends Repository<Chain> {
  constructor(private readonly dataSource: DataSource) {
    super(Chain, dataSource.createEntityManager());
  }

  async fetchAllChains(): Promise<Chain[]> {
    return this.find();
  }
}
