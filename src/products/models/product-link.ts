export class ProductLink {
  sku: string = '';
  link_type: 'related' | 'upsell' | 'crosssell' | 'associated' = 'related';
  linked_product_sku: string = '';
  linked_product_type: string = '';
  position: number = 0;
}
