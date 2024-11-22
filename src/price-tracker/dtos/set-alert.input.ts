import { ApiProperty } from '@nestjs/swagger';

export class SetAlertInput {
  @ApiProperty({ examples: ['0x1', '0x89'] })
  chain: string;

  @ApiProperty({ example: '100' })
  dollar: string;

  @ApiProperty({ example: 'test@gmail.com' })
  email: string;
}
