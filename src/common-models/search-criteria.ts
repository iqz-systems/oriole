import { SearchFilterGroup } from './search-filter-group';
import { SearchSortOrder } from './search-sort-order';
import { Type } from 'class-transformer';

export class SearchCriteria {

  @Type(() => SearchFilterGroup)
  private filter_groups: SearchFilterGroup[];
  @Type(() => SearchSortOrder)
  private sort_orders: SearchSortOrder[];
  private pageSize: number;
  private currentPage: number;

  constructor() {
    this.filter_groups = [];
    this.sort_orders = [];
    this.pageSize = -1;
    this.currentPage = -1;
  }

  /**
   * Sets the page size of the search result. You can paginate the results by combining this with `setCurrentPage` method.
   * @method setPageSize
   * @param pageSize The page size for the search result. Set it to a negative number to remove the criteria.
   */
  setPageSize(pageSize: number): void {
    if (pageSize < 0) {
      pageSize = -1;
    }
    this.pageSize = pageSize;
  }

  /**
   * Sets the current page to be retrieved by the search. Works in combination with `setPageSize`.
   * @method setCurrentPage
   * @param currentPage The current page of the search result. Set it to a negative number to remove the critieria.
   */
  setCurrentPage(currentPage: number): void {
    if (currentPage < 0) {
      currentPage = -1;
    }
    this.currentPage = currentPage;
  }

  /**
   * Add a search filter group. i.e. AND condition.
   * @method addSearchFilterGroup
   * @param  filterGroup          A filter group to describe the condition.
   */
  addSearchFilterGroup(filterGroup: SearchFilterGroup): void {
    this.filter_groups.push(filterGroup);
  }

  /**
   * Add a sort to the current search.\
   * @method addSearchSortOrder
   * @param sortOrder The sort order for the search.
   */
  addSearchSortOrder(sortOrder: SearchSortOrder): void {
    this.sort_orders.push(sortOrder);
  }

  /**
   * Get the string representation of the SearchCriteria
   * @method toString
   * @return Returns the search criteria as a string.
   */
  toString(): string {
    let criteriaString: string = '';

    // Add in the filter groups ...
    for (let i = 0; i < this.filter_groups.length; i++) {
      const fGroup = this.filter_groups[i];
      let fGroupString = '';
      for (let j = 0; j < fGroup.filters.length; j++) {
        const filter = fGroup.filters[j];
        let fString = `searchCriteria[filter_groups][${i}][filters][${j}][field]=${filter.field}&`
          + `searchCriteria[filter_groups][${i}][filters][${j}][value]=${filter.value}&`;
        if (filter.condition_type) {
          fString += `searchCriteria[filter_groups][${i}][filters][${j}][condition_type]=${filter.condition_type}&`;
        }
        fGroupString += fString;
      }
      criteriaString += fGroupString;
    }

    // ... and the sort orders ...
    for (let i = 0; i < this.sort_orders.length; i++) {
      const sOrder = this.sort_orders[i];
      const sOrderString = `searchCriteria[sortOrders][${i}][field]=${sOrder.field}&`
        + `searchCriteria[sortOrders][${i}][direction]=${sOrder.direction}&`;
      criteriaString += sOrderString;
    }

    // ... and finally, the page size and current page.
    if (this.pageSize > 0) {
      criteriaString += `searchCriteria[pageSize]=${this.pageSize}&`;
    }
    if (this.currentPage > 0) {
      criteriaString += `searchCriteria[currentPage]=${this.currentPage}&`;
    }

    // Clip last '&' from string;
    criteriaString = criteriaString.substring(0, criteriaString.length - 1);
    return criteriaString;
  }

  /**
   * Adds a search criteria to search by name of product.
   * @method addSearchByNameCriteria
   * @param  searchPhrase        The search phrase to search for in the name field.
   */
  addSearchByNameCriteria(searchPhrase: string): void {
    const filterGroup = new SearchFilterGroup();
    filterGroup.addSearchFilter('name', `%${searchPhrase}%`, 'like');
    this.filter_groups.push(filterGroup);
  }

  /**
   * Adds a search criteria to search by sku of product.
   * @method addSearchBySkuCriteria
   * @param  searchPhrase         The search phrase to search for in the sku field.
   */
  addSearchBySkuCriteria(searchPhrase: string): void {
    const filterGroup = new SearchFilterGroup();
    filterGroup.addSearchFilter('sku', `%${searchPhrase}%`, 'like');
    this.filter_groups.push(filterGroup);
  }

  /**
   * Adds a search criteria to search by name or sku of product.
   * @method addSearchByNameOrSku
   * @param  searchPhrase         The search phrase to search for in the sku field.
   */
  addSearchByNameOrSkuCriteria(searchPhrase: string): void {
    const filterGroup = new SearchFilterGroup();
    filterGroup.addSearchFilter('sku', `%${searchPhrase}%`, 'like');
    filterGroup.addSearchFilter('name', `%${searchPhrase}%`, 'like');
    this.filter_groups.push(filterGroup);
  }
}
