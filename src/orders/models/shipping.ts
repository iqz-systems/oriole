import { Type } from 'class-transformer';
import { BillingAddress } from './billing_address';
import { Total } from './total';

export class Shipping {

  @Type(() => BillingAddress)
  address: BillingAddress = new BillingAddress();
  method: string = '';

  @Type(() => Total)
  total: Total = new Total();
}
