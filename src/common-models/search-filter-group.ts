import { SearchFilter, ConditionType } from './search-filter';

/**
 * AND condition on search criteria
 */
export class SearchFilterGroup {
  filters: SearchFilter[];

  constructor() {
    this.filters = [];
  }

  /**
   * Add a search filter i.e. OR condition.
   * @method addSearchFilter
   * @param  field           The field name to search for.
   * @param  value           The value of the field. You can use SQL wildcards for 'like' condition type.
   * @param  condition_type  Optional. The condition type to match the value with the field.
   */
  addSearchFilter(field: string, value: string | number, condition_type?: ConditionType): void {
    const filter = new SearchFilter(field, value, condition_type);
    this.filters.push(filter);
  }
}
