import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chain } from './chains.entity';

@Entity('prices')
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chain, (chain) => chain.prices, { onDelete: 'CASCADE' })
  chain: Chain;

  @Column({ type: 'decimal' })
  price: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  recordedAt: Date;
}
