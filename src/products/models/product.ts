import { Type, Expose } from 'class-transformer';
import { CustomAttribute } from '../../common-models';

export class Product {

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

  @Type(() => CustomAttribute)
  custom_attributes: CustomAttribute[] = [];

  // TODO Add extension attribute typings here.

  /**
   * Shortcut to get the product image url from the custom_attributes array.
   * @method image
   * @return The product image url. Empty string, if not available.
   */
  @Expose() get image(): string {
    if (!this.custom_attributes || this.custom_attributes.length < 1) {
      return '';
    }

    const imageAttr = this.custom_attributes.find(attr => attr.attribute_code == 'image');
    if (!imageAttr) {
      return '';
    }

    return `/media/catalog/product${imageAttr.value}`;
  }

  /**
   * Shortcut to get the product description from the custom_attributes array.
   * @method description
   * @return The product description. Empty string, if not available.
   */
  @Expose() get description(): string {
    if (!this.custom_attributes || this.custom_attributes.length < 1) {
      return '';
    }

    const descriptionAttr = this.custom_attributes.find(attr => attr.attribute_code == 'description');
    if (!descriptionAttr) {
      return '';
    }

    return descriptionAttr.value as string;
  }
}
