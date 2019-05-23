import { Type } from 'class-transformer';
import { Address } from './address';
import { Total } from './total';

export class Shipping {

  @Type(() => Address)
  address: Address = new Address();
  method: string = '';

  @Type(() => Total)
  total: Total = new Total();
}
