import { Type } from 'class-transformer';
import { StockItem } from './stock-item';
import { CategoryLink } from '../../common-models';

export class ExtensionAttributes {
  website_ids: number[] = [];

  @Type(() => CategoryLink)
  category_links: CategoryLink[] = [];

  @Type(() => StockItem)
  stock_item: StockItem = new StockItem();
}
