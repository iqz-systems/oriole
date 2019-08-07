import { Type } from 'class-transformer';
import { CustomerExtensionAttribute } from './customer-extension-attribute';
import { CustomerAddress } from './customer-address';

export class Customer {

  id: number = 0;
  group_id: number = 0;
  default_billing?: string;
  default_shipping?: string;
  created_at: string = '';
  updated_at: string = '';
  created_in: string = '';
  email: string = '';
  firstname: string = '';
  lastname: string = '';
  store_id: number = 0;
  website_id: number = 0;

  @Type(() => CustomerAddress)
  addresses: CustomerAddress[] = [];
  disable_auto_group_change: number = 0;
  gender?: number;

  @Type(() => CustomerExtensionAttribute)
  extension_attributes?: CustomerExtensionAttribute;
}
