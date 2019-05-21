export class StockItem {
  item_id: number = 0;
  product_id: number = 0;
  stock_id: number = 0;
  qty: number = 0;
  is_in_stock: boolean = false;
  is_qty_decimal: boolean = false;
  show_default_notification_message: boolean = false;
  use_config_min_qty: boolean = false;
  min_qty: number = 0;
  use_config_min_sale_qty: number = 0;
  min_sale_qty: number = 0;
  use_config_max_sale_qty: boolean = false;
  max_sale_qty: number = 0;
  use_config_backorders: boolean = false;
  backorders: number = 0;
  use_config_notify_stock_qty: boolean = false;
  notify_stock_qty: number = 0;
  use_config_qty_increments: boolean = false;
  qty_increments: number = 0;
  use_config_enable_qty_inc: boolean = false;
  enable_qty_increments: boolean = false;
  use_config_manage_stock: boolean = false;
  manage_stock: boolean = false;
  low_stock_date?: any;
  is_decimal_divided: boolean = false;
  stock_status_changed_auto: number = 0;
}
