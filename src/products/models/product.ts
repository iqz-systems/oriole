import { Type, Expose } from 'class-transformer';
import { CustomAttribute, MediaGalleryEntry } from '../../common-models';
import { ExtensionAttributes } from './extension-attributes';
import { ProductLink } from './product-link';

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

  @Type(() => Date)
  product_links: ProductLink[] = [];
  tier_prices: any[] = [];
  options: any[] = [];

  @Type(() => CustomAttribute)
  custom_attributes: CustomAttribute[] = [];

  @Type(() => ExtensionAttributes)
  extension_attributes: ExtensionAttributes = new ExtensionAttributes();

  @Type(() => MediaGalleryEntry)
  media_gallery_entries: MediaGalleryEntry[] = [];

  /**
   * Shortcut to get the stock status of the product from custom attributes.
   * @method isInStock
   * @return Returns `true` if the item is in stock; `false` if it's not or cannot be determined.
   */
  @Expose() get isInStock(): boolean {
    if (!this.custom_attributes || this.custom_attributes.length < 1) {
      return false;
    }

    const stockAttr = this.custom_attributes.find(attr => attr.attribute_code == 'quantity_and_stock_status');
    if (!stockAttr) {
      return false;
    }

    return (stockAttr.value as [boolean, number])[0];
  }

  /**
   * Shortcut to get the quantity of the product in stock from custom attribute.
   * @method quantityInStock
   * @return Returns a number indicating the quantity of product in stock. Returns, 0 in cases where it can't be determined.
   */
  @Expose() get quantityInStock(): number {
    if (!this.custom_attributes || this.custom_attributes.length < 1) {
      return 0;
    }

    const stockAttr = this.custom_attributes.find(attr => attr.attribute_code == 'quantity_and_stock_status');
    if (!stockAttr) {
      return 0;
    }

    return (stockAttr.value as [boolean, number])[1];
  }

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
