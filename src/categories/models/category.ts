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
  custom_attributes: CustomAttribute[] = [];
}
