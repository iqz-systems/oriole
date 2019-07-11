import { RestClient } from './rest-client';
import { ProductsClient, ProductAttributesClient } from './products';
import { CategoriesClient } from './categories';
import { IOrioleOptions } from './oriole-options.interface';
import { OrdersClient } from './orders';
import { IntegrationClient } from './integration';

/**
 * Base Oriole module.
 * @method constructor
 * @param  options     Options to initialize the module.
 */
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
  productAttributes: ProductAttributesClient;
  /**
   * The client to interact with categories in Magento 2 store.
   */
  categories: CategoriesClient;
  /**
   * The client to interact with categories in Magento 2 store.
   */
  orders: OrdersClient;
  integration: IntegrationClient;

  constructor(options: IOrioleOptions) {
    this.client = new RestClient({
      url: options.url,
      apiVersion: Oriole.MAGENTO_API_VERSION,
      storeId: options.storeId ? options.storeId : 'default',
      oauth: options.oauth,
      bearer: options.bearer,
    });

    this.products = new ProductsClient(this.client);
    this.productAttributes = new ProductAttributesClient(this.client);
    this.orders = new OrdersClient(this.client);
    this.categories = new CategoriesClient(this.client);
    this.integration = new IntegrationClient(this.client);
  }
}
