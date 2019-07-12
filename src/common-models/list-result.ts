import { Type } from 'class-transformer';
import { SearchCriteria } from './search-criteria';

export class ListResult<T> implements IListResult<T> {
  readonly items: T[];

  @Type(() => SearchCriteria)
  readonly search_criteria: SearchCriteria;

  readonly total_count: number;

  constructor(listResult: IListResult<T>, items?: T[]) {
    this.search_criteria = listResult.search_criteria;
    this.total_count = listResult.total_count;
    if (items) {
      this.items = items;
    } else if (listResult.items) {
      this.items = listResult.items;
    } else {
      this.items = [];
    }
  }
}

interface IListResult<T> {
  items?: T[];
  search_criteria: SearchCriteria;
  total_count: number;
}
