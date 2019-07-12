import { Type } from 'class-transformer';
import * as _ from 'lodash';

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

  /**
   * Get if this item has child items.
   * @method hasChildren
   * @return Returns true if the item has child items. False, otherwise.
   */
  get hasChildren(): boolean {
    return this.children_data.length > 0;
  }

  /**
   * Takes every CategoryListResult item in the input array and 'moves' its
   * children to the top-most level. The children_data property of each item is
   * made empty. DOES NOT MUTATE INPUT.
   * @method flattenCategoryListResults
   * @param  results                    A CategoryListResult array fetched from the API.
   * @return                            An array containing all CategoryResultItems in one level.
   */
  static flattenCategoryListResults(results: CategoryListResult[]): CategoryListResult[] {
    const resultsCopy = _.map(results, _.cloneDeep);

    let flattenedResults: CategoryListResult[] = [];

    flattenedResults = flattenedResults.concat(resultsCopy);
    for (const result of resultsCopy) {
      if (result.hasChildren) {
        flattenedResults = flattenedResults.concat(CategoryListResult.flattenCategoryListResults(result.children_data));
      }
    }

    for (const flat of flattenedResults) {
      flat.children_data = [];
    }

    return flattenedResults;
  }
}
