import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Alert } from '../entities/alerts.entity';

@Injectable()
export class AlertRepository extends Repository<Alert> {
  constructor(private readonly dataSource: DataSource) {
    super(Alert, dataSource.createEntityManager());
  }
}
