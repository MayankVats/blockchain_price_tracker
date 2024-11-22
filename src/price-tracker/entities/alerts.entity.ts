import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chain } from './chains.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chain, (chain) => chain.prices, { onDelete: 'CASCADE' })
  chain: Chain;

  @Column({ type: 'decimal' })
  thresholdPrice: number;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;
}
