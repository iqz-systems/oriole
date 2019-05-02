export class ListResult<T> implements IListResult<T>{
  readonly items: T[] = [];
  readonly search_criteria: { filter_groups: any[]; } = { filter_groups: [] };
  readonly total_count: number = 0;

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
  search_criteria: { filter_groups: any[]; };
  total_count: number;
}
