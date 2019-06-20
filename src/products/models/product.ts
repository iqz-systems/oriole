import { Type, Expose } from 'class-transformer';
import { CustomAttribute, MediaGalleryEntry } from '../../common-models';
import { ProductLink } from './product-link';
import { ProductExtensionAttributes } from './product-extension-attributes';

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

  @Type(() => ProductExtensionAttributes)
  extension_attributes: ProductExtensionAttributes = new ProductExtensionAttributes();

  @Type(() => MediaGalleryEntry)
  media_gallery_entries: MediaGalleryEntry[] = [];

  /**
   * Shortcut to get the stock status of the product from extension attributes.
   * @method isInStock
   * @return Returns `true` if the item is in stock; `false` if it's not or cannot be determined.
   */
  @Expose() get isInStock(): boolean {
    if (!this.extension_attributes || !this.extension_attributes.stock_item) {
      return false;
    }

    return this.extension_attributes.stock_item.is_in_stock;
  }

  /**
   * Shortcut to get the quantity of the product in stock from extension attributes.
   * @method quantityInStock
   * @return Returns a number indicating the quantity of product in stock. Returns, 0 in cases where it can't be determined.
   */
  @Expose() get quantityInStock(): number {
    if (!this.extension_attributes || !this.extension_attributes.stock_item) {
      return 0;
    }

    return this.extension_attributes.stock_item.qty;
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
