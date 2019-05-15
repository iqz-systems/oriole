import { Type } from "class-transformer";

export class Items {
  amount_refunded: number = 0;
  base_amount_refunded: number = 0;
  base_discount_amount: number = 0;
  base_discount_invoiced: number = 0;
  base_discount_tax_compensation_amount: number = 0;
  base_original_price: number = 0;
  base_price: number = 0;
  base_price_incl_tax: number = 0;
  base_row_invoiced: number = 0;
  base_row_total: number = 0;
  base_row_total_incl_tax: number = 0;
  base_tax_amount: number = 0;
  base_tax_invoiced: number = 0;
  
  @Type(() => Date)
  created_at: Date = new Date();

  discount_amount: number = 0;
  discount_invoiced: number = 0;
  discount_percent: number = 0;
  free_shipping: number = 0;
  discount_tax_compensation_amount: number = 0;
  is_qty_decimal: number = 0;
  is_virtual: number = 0;
  item_id: number = 0;
  name: string = '';
  no_discount: number = 0;
  order_id: number = 0;
  original_price: number = 0;
  price: number = 0;
  price_incl_tax: number = 0;
  product_id: number = 0;
  product_type: string = '';
  qty_canceled: number = 0;
  qty_invoiced: number = 0;
  qty_ordered: number = 0;
  qty_refunded: number = 0;
  qty_shipped: number = 0;
  quote_item_id: number = 0;
  row_invoiced: number = 0;
  row_total: number = 0;
  row_total_incl_tax: number = 0;
  row_weight: number = 0;
  sku: string = '';
  store_id: number = 0;
  tax_amount: number = 0;
  tax_invoiced: number = 0;
  tax_percent: number = 0;

  @Type(() => Date)
  updated_at: Date = new Date();

}
