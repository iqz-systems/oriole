import { Type } from 'class-transformer';
import { CustomerAddressRegion } from './customer-address-region';

export class CustomerAddress {
  id: number = 0;
  customer_id: number = 0;

  @Type(() => CustomerAddressRegion)
  region: CustomerAddressRegion = new CustomerAddressRegion();

  region_id: number = 0;
  country_id: string = '';
  street: string[] = [];
  telephone: string = '';
  postcode: string = '';
  city: string = '';
  firstname: string = '';
  lastname: string = '';
  default_shipping: boolean = false;
  default_billing: boolean = false;
}
