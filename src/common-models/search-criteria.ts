import { SearchFilterGroup } from './search-filter-group';

export class SearchCriteria {

  private filterGroups: SearchFilterGroup[];

  constructor() {
    this.filterGroups = [];
  }

  /**
   * Add a search filter group. i.e. AND condition.
   * @method addSearchFilterGroup
   * @param  filterGroup          A filter group to describe the condition.
   */
  addSearchFilterGroup(filterGroup: SearchFilterGroup): void {
    this.filterGroups.push(filterGroup);
  }

  /**
   * Adds a search criteria to search by name of product.
   * @method addSearchByNameCriteria
   * @param  searchPhrase        The search phrase to search for in the name field.
   */
  addSearchByNameCriteria(searchPhrase: string): void {
    const filterGroup = new SearchFilterGroup();
    filterGroup.addSearchFilter('name', `%${searchPhrase}%`, 'like');
    this.filterGroups.push(filterGroup);
  }

  /**
   * Adds a search criteria to search by sku of product.
   * @method addSearchBySkuCriteria
   * @param  searchPhrase         The search phrase to search for in the sku field.
   */
  addSearchBySkuCriteria(searchPhrase: string): void {
    const filterGroup = new SearchFilterGroup();
    filterGroup.addSearchFilter('sku', `%${searchPhrase}%`, 'like');
    this.filterGroups.push(filterGroup);
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
    this.filterGroups.push(filterGroup);
  }

  /**
   * Get the string representation of the SearchCriteria
   * @method toString
   * @return Returns the search criteria as a string starting with '[filter_groups]...'
   */
  toString(): string {
    let criteriaString: string = '';

    for (let i = 0; i < this.filterGroups.length; i++) {
      const fGroup = this.filterGroups[i];
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

    // Clip last '&' from string;
    criteriaString = criteriaString.substring(0, criteriaString.length - 1);
    return criteriaString;
  }
}
