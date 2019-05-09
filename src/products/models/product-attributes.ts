import { Type } from 'class-transformer';
import { ProductAttributeOption } from './product-attribute-option';

export class ProductAttributes {
  apply_to: string[] = [];
  attribute_code: string = '';
  attribute_id: number = 0;
  backend_model?: string;
  backend_type: string = '';
  default_frontend_label: string = '';
  default_value?: string;
  entity_type_id: string = '';
  frontend_class: string = '';
  frontend_input: string = '';
  frontend_labels: string[] = [];
  is_comparable: string = '0';
  is_filterable_in_grid: boolean = false;
  is_filterable_in_search: boolean = false;
  is_filterable: boolean = false;
  is_html_allowed_on_front: boolean = false;
  is_required: boolean = true;
  is_searchable: string = '1';
  is_unique: string = '0';
  is_used_for_promo_rules: string = '0';
  is_used_in_grid: boolean = false;
  is_user_defined: boolean = false;
  is_visible_in_advanced_search: string = '1';
  is_visible_in_grid: boolean = false;
  is_visible_on_front: string = '0';
  is_visible: boolean = true;
  is_wysiwyg_enabled: boolean = false;
  note?: string;

  @Type(() => ProductAttributeOption)
  options: ProductAttributeOption[] = [];

  position: number = 0;
  scope: 'global' | 'store' = 'store';
  source_model?: string;
  used_for_sort_by: boolean = false;
  used_in_product_listing: string = '1';
  validation_rules: any[] = [];
}
