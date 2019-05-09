import { Expose, Type } from 'class-transformer';
import { CustomAttribute } from '../../common-models';

export class Category {
  id: number = 0;
  parent_id: number = 0;
  name: string = '';
  is_active: boolean = false;
  position: number = 0;
  level: number = 0;
  children: string = '';
  created_at: string = '';
  updated_at: string = '';
  path: string = '';
  available_sort_by: any[] = [];
  include_in_menu: boolean = false;

  @Type(() => CustomAttribute)
  custom_attributes: CustomAttribute[] = [];

  /**
   * Shortbut to get the category description from custom_attributes array.
   * @method description
   * @return The category description as HTML text. Empty string, if not available.
   */
  @Expose() get description(): string {
    if (!this.custom_attributes || (this.custom_attributes.length < 1)) {
      return '';
    }
    const descriptionAttr = this.custom_attributes.find(attr => attr.attribute_code == 'description');
    if (!descriptionAttr) {
      return '';
    }
    return descriptionAttr.value as string;
  }

  /**
   * Shortcut to get the category image name from the custom_attributes array.
   * @method image
   * @return The category image name. Empty string, if not available.
   */
  @Expose() get image(): string {
    if (!this.custom_attributes || (this.custom_attributes.length < 1)) {
      return '';
    }
    const imageAttr = this.custom_attributes.find(attr => attr.attribute_code == 'image');
    if (!imageAttr) {
      return '';
    }
    return imageAttr.value as string;
  }

  /**
   * Shortcut to get the category image url from the custom_attributes array.
   * @method imageUrl
   * @return The category image url. Empty string, if not available.
   */
  @Expose() get imageUrl(): string {
    if (this.image == '') {
      return '';
    }

    return `/media/catalog/category/${this.image}`;
  }
}
