import { Type } from 'class-transformer';
import { Item } from './item';
import { Shipping } from './shipping';

export class ShippingAssignment {

  @Type(() => Shipping)
  shipping: Shipping = new Shipping();

  @Type(() => Item)
  items: Item[] = [];
}
