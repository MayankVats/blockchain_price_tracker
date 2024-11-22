import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Price } from '../entities/prices.entity';

@Injectable()
export class PriceRepository extends Repository<Price> {
  constructor(private readonly dataSource: DataSource) {
    super(Price, dataSource.createEntityManager());
  }
}
