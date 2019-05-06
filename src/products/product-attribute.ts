import { Type } from 'class-transformer';
import { ProductCustomAttribute } from './product-custom-attribute';

export class ProductAttribute {

  id?: number;
  sku?: string;
  name?: string;
  attribute_set_id?: number;
  price?: number;
  status?: number;
  visibility?: number;
  type_id?: string;

  @Type(() => Date)
  created_at?: Date;

  @Type(() => Date)
  updated_at?: Date;

  product_links?: any[];
  tier_prices?: any[];

  @Type(() => ProductCustomAttribute)
  custom_attributes?: ProductCustomAttribute[];
}
