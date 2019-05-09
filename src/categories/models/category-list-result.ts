import { Type } from 'class-transformer';

export class CategoryListResult {
  id: number = 0;
  parent_id: number = 0;
  name: string = '';
  is_active: boolean = false;
  position: number = 0;
  level: number = 0;
  product_count: number = 0;

  @Type(() => CategoryListResult)
  children_data: CategoryListResult[] = [];
}
