import { Items } from "./items";
import { Shipping } from "./shipping";
import { Type } from "class-transformer";

export class ShippingAssignments {
  @Type(() => ListShippingAssignments)
  shipping_assignments: ListShippingAssignments[] = [];
}

export class ListShippingAssignments {
  @Type(() => Shipping)
  shipping: Shipping = new Shipping();
  @Type(() => Items)
  items: Items[] = [];
}
