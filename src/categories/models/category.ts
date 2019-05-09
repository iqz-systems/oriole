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
   * Gets the category description.
   * @method description
   * @return The category description as HTML text.
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
}
