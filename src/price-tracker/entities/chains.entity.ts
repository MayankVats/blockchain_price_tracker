import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Price } from './prices.entity';
import { Alert } from './alerts.entity';

@Entity('chains')
export class Chain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  hexId: string;

  @Column()
  tokenId: string;

  @OneToMany(() => Price, (price) => price.chain)
  prices: Price[];

  @OneToMany(() => Alert, (alert) => alert.chain)
  alerts: Alert[];
}
