import { BillingAddress } from "./billing_address";
import { Total } from "./total";

export class Shipping{
  address: BillingAddress = new BillingAddress();
  method: string = '';
  total: Total = new Total();
}
