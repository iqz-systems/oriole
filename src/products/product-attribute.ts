import { Type } from 'class-transformer';
import { ProductCustomAttribute } from './product-custom-attribute';

export class ProductAttribute {

  id: number = 0;
  sku: string = '';
  name: string = '';
  attribute_set_id: number = 0;
  price: number = 0;
  status: number = 0;
  visibility: number = 0;
  type_id: string = '';

  @Type(() => Date)
  created_at: Date = new Date();

  @Type(() => Date)
  updated_at: Date = new Date();

  product_links: any[] = [];
  tier_prices: any[] = [];

  @Type(() => ProductCustomAttribute)
  custom_attributes: ProductCustomAttribute[] = [];
}
