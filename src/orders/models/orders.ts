import { Type } from 'class-transformer';
import { Items } from './items';
import { BillingAddress } from './billing_address';
import { Payment } from './payment';
import { ShippingAssignments } from './shipping_assignments';

export class Orders {
  base_currency_code: string = '';
  base_discount_amount: number = 0;
  base_grand_total: number = 0;
  base_discount_tax_compensation_amount: number = 0;
  base_shipping_amount: number = 0;
  base_shipping_discount_amount: number = 0;
  base_shipping_incl_tax: number = 0;
  base_shipping_tax_amount: number = 0;
  base_subtotal: number = 0;
  base_subtotal_incl_tax: number = 0;
  base_tax_amount: number = 0;
  base_total_due: number = 0;
  base_to_global_rate: number = 0;
  base_to_order_rate: number = 0;
  base_discount_canceled: number = 0;
  base_shipping_canceled: number = 0;
  base_subtotal_canceled: number = 0;
  base_tax_canceled: number = 0;
  base_total_canceled: number = 0;
  billing_address_id: number = 0;

  @Type(() => Date)
  created_at: Date = new Date();

  customer_email: string = '';
  customer_firstname: string = '';
  customer_group_id: number = 0;
  customer_gender: number = 0;
  customer_id: number = 0;
  customer_is_guest: number = 0;
  customer_lastname: string = '';
  customer_note_notify: number = 0;
  discount_amount: number = 0;
  email_sent: number = 0;
  entity_id: number = 0;
  global_currency_code: number = 0;
  grand_total: number = 0;
  discount_tax_compensation_amount: number = 0;
  discount_canceled: number = 0;
  shipping_canceled: number = 0;
  subtotal_canceled: number = 0;
  tax_canceled: number = 0;
  total_canceled: number = 0;
  increment_id: string = '';
  is_virtual: boolean = false;
  order_currency_code: string = '';
  protect_code: string = '';
  quote_id: number = 0;
  remote_ip: string = '';
  shipping_amount: number = 0;
  shipping_description: string = '';
  shipping_discount_amount: number = 0;
  shipping_discount_tax_compensation_amount: number = 0;
  shipping_incl_tax: number = 0;
  shipping_tax_amount: number = 0;
  state: string = '';
  status: string = '';
  store_currency_code: string = '';
  store_id: number = 0;
  store_name: string = '';
  store_to_base_rate: number = 0;
  store_to_order_rate: number = 0;
  subtotal: number = 0;
  subtotal_incl_tax: number = 0;
  tax_amount: number = 0;
  total_due: number = 0;
  total_item_count: number = 0;
  total_qty_ordered: number = 0;

  @Type(() => Date)
  updated_at: Date = new Date();

  weight: number = 0;

  @Type(() => Items)
  items: Items[] = [];

  @Type(() => BillingAddress)
  billing_address: BillingAddress = new BillingAddress();

  @Type(() => Payment)
  payment: Payment = new Payment();

  status_histories: string[] = [];

  @Type(() => ShippingAssignments)
  extension_attributes: ShippingAssignments = new ShippingAssignments();

  /**
   * Shortcut to return a subset of order details.
   * @method simplifiedOrderDetails
   * @return Returns a subset of the order details in a simplified form.
   */
  get simplifiedOrderDetails(): ISimplifiedOrderDetails {
    const simpleOrderDet: ISimplifiedOrderDetails = {
      customerFirstName: this.customer_firstname,
      customerLastName: this.customer_lastname,
      customerEmail: this.customer_email,
      customerIsGuest: (this.customer_is_guest == 1) ? true : false,
      customerId: this.customer_id,
      totalDue: this.total_due,
      totalItemCount: this.total_item_count,
      baseSubtotalIncludingTax: this.base_subtotal_incl_tax,
      baseShippingIncludingTax: this.base_shipping_incl_tax,
      items: this.items.map(item => {
        return {
          name: item.name,
          priceIncludingTax: item.price_incl_tax,
          productId: item.product_id
        };
      })
    };
    return simpleOrderDet;
  }
}

export interface ISimplifiedOrderDetails {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerIsGuest: boolean;
  customerId: number;
  totalDue: number;
  totalItemCount: number;
  baseSubtotalIncludingTax: number;
  baseShippingIncludingTax: number;
  items: {
    name: string;
    priceIncludingTax: number;
    productId: number;
  }[];
}
