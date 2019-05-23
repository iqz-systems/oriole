import { Type } from 'class-transformer';
import { Address } from './address';
import { Total } from './total';

export class Shipping {

  method: string = '';

  @Type(() => Address)
  address: Address = new Address();

  @Type(() => Total)
  total: Total = new Total();
}
