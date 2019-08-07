/**
 * Adds a sort order for the search condition.
 */
export class SearchSortOrder {

  /**
   * The field on which sorting must be applied.
   */
  field: string;
  /**
   * The sort direction.
   */
  direction: 'ASC' | 'DESC';

  /**
   * Creates a `SearchSortOrder` object.
   * @param field The field on which sorting must be applied.
   * @param direction The sort direction. Defaults to descending order, if not specified.
   */
  constructor(field: string, direction: 'ASC' | 'DESC' = 'DESC') {
    this.field = field;
    this.direction = direction;
  }
}
