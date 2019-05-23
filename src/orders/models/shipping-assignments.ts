import { Type } from 'class-transformer';
import { Item } from './item';
import { Shipping } from './shipping';

export class ShippingAssignments {
  @Type(() => ListShippingAssignments)
  shipping_assignments: ListShippingAssignments[] = [];
}

export class ListShippingAssignments {

  @Type(() => Shipping)
  shipping: Shipping = new Shipping();

  @Type(() => Item)
  items: Item[] = [];
}
