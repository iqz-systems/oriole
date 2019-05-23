export class Payment {
  account_status: string = '';
  additional_information: string[] = [];
  amount_ordered: number = 0;
  base_amount_ordered: number = 0;
  base_shipping_amount: number = 0;
  cc_last4: string = '';
  entity_id: number = 0;
  method: string = '';
  parent_id: number = 0;
  shipping_amount: number = 0;
  extension_attributes: string[] = [];
}
