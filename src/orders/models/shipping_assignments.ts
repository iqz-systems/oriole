import { Items } from "./items";
import { Shipping } from "./shipping";

export class ShippingAssignments {
  shipping_assignments: ListShippingAssignments[] = [];
}

export class ListShippingAssignments {
  shipping: Shipping = new Shipping();
  items: Items[] = [];
}
