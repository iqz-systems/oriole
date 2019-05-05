import { RestClient } from './rest-client';
import { ProductsClient, ProductAttributePropertiesClient } from './products';
import { CategoriesClient } from './categories';
import { IOrioleOptions } from './oriole-options.interface';

export class Oriole {

  static readonly MAGENTO_API_VERSION: string = 'V1';

  private client: RestClient;

  /**
   * The client to interact with products in Magento 2 store.
   */
  products: ProductsClient;
  /**
   * The client to interact with product attributes in Magento 2 store.
   */
  productAttributes: ProductAttributePropertiesClient;
  /**
   * The client to interact with categories in Magento 2 store.
   */
  categories: CategoriesClient;

  constructor(options: IOrioleOptions) {
    this.client = new RestClient({
      url: options.url,
      apiVersion: Oriole.MAGENTO_API_VERSION,
      storeId: options.storeId ? options.storeId : 'default',
      oauth: options.oauth,
      bearer: options.bearer
    });

    this.products = new ProductsClient(this.client);
    this.productAttributes = new ProductAttributePropertiesClient(this.client);
    this.categories = new CategoriesClient(this.client);
  }
}
